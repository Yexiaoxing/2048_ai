import {
	type AIConfig,
	aiConfigStore,
} from "@2048/game-logic/game-ai/game-ai-configs";
import { queryAvailableModels } from "@2048/game-logic/game-ai/game-ai-local";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { styled } from "styled-components";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import {
	Field,
	FieldControl,
	FieldDescription,
	FieldErrorDescription,
	FieldItem,
	FieldLabel,
} from "../ui/field";
import { Radio, RadioContainer, RadioGroup } from "../ui/radio";
import { Select } from "../ui/select";

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

export const AiSettingsDialog: React.FC = () => {
	const [open, setOpen] = useState(false);

	const [aiProvider, setAIProvider] = useState<"local" | "remote">("local");
	const [apiEndpoint, setApiEndpoint] = useState("");
	const [apiSecret, setApiSecret] = useState("");
	const [selectedLocalModel, setSelectedLocalModel] = useState("");
	const [selectedRemoteModel, setSelectedRemoteModel] = useState("");
	const [availableModels, setAvailableModels] = useState<string[]>([]);
	const [loadingModels, setLoadingModels] = useState(false);
	const [savingConfig, setSavingConfig] = useState(false);

	const [fetchModelError, setFetchModelError] = useState<string | null>(null);

	const loadConfig = useCallback(async () => {
		try {
			const config = await aiConfigStore.getConfig();
			if (config) {
				setAIProvider(config.aiProvider);
				setApiEndpoint(config.apiEndpoint);
				setApiSecret(config.apiSecret);
				setSelectedLocalModel(config.selectedLocalModel);
				setSelectedRemoteModel(config.selectedRemoteModel);
			}
		} catch (error) {
			console.error("Failed to load AI config:", error);
		}
	}, []);

	const fetchLocalModels = useCallback(async () => {
		setLoadingModels(true);
		setFetchModelError(null);
		try {
			const models = await queryAvailableModels();
			setAvailableModels(models);
			if (models.length > 0 && !selectedLocalModel) {
				setSelectedLocalModel(models[0]);
			}
		} catch (error) {
			setFetchModelError(`Failed to fetch models: ${(error as Error).message}`);
		} finally {
			setLoadingModels(false);
		}
	}, [selectedLocalModel]);

	useEffect(() => {
		if (open) {
			loadConfig();
		}
	}, [open, loadConfig]);

	useEffect(() => {
		if (aiProvider === "local" && open) {
			fetchLocalModels();
		}
	}, [aiProvider, open, fetchLocalModels]);

	const refreshOllamaStatus = async () => {
		await fetchLocalModels();
	};

	const onSave = useCallback(async () => {
		setSavingConfig(true);
		try {
			const config: AIConfig = {
				aiProvider,
				apiEndpoint,
				apiSecret,
				selectedLocalModel,
				selectedRemoteModel,
			};
			await aiConfigStore.saveConfig(config);
			setOpen(false);
		} catch (error) {
			console.error("Failed to save AI config:", error);
		} finally {
			setSavingConfig(false);
		}
	}, [
		aiProvider,
		apiEndpoint,
		apiSecret,
		selectedLocalModel,
		selectedRemoteModel,
	]);

	return (
		<Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
			<DialogTrigger>
				<Button variant="yellow">Open AI Settings</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit AI Settings</DialogTitle>
					<DialogDescription>Make changes to AI settings.</DialogDescription>
				</DialogHeader>
				<form action={onSave}>
					<FormContainer>
						<Field data-orientation="vertical">
							<FieldLabel htmlFor="ai-model">AI Provider Type</FieldLabel>
							<RadioGroup
								value={aiProvider}
								onValueChange={(value) =>
									setAIProvider(value as "local" | "remote")
								}
							>
								<FieldItem>
									<RadioContainer>
										<Radio value="local" />
										<FieldLabel>Local Ollama</FieldLabel>
									</RadioContainer>
								</FieldItem>
								<FieldItem>
									<RadioContainer>
										<Radio value="remote" />
										<FieldLabel>Remote AI (OpenAI API)</FieldLabel>
									</RadioContainer>
								</FieldItem>
							</RadioGroup>
						</Field>
						{aiProvider === "remote" && (
							<>
								<Field data-orientation="vertical">
									<FieldLabel htmlFor="ai-endpoint">
										API Endpoint (OpenAI Compatiable Endpoint)
									</FieldLabel>
									<FieldControl
										id="ai-endpoint"
										type="text"
										placeholder="https://api.openai.com/v1/chat/completions"
										value={apiEndpoint}
										onValueChange={setApiEndpoint}
									/>
								</Field>
								<Field data-orientation="vertical">
									<FieldLabel htmlFor="ai-secret">API Secret</FieldLabel>
									<FieldControl
										id="ai-secret"
										type="password"
										placeholder="Enter your API secret"
										value={apiSecret}
										onValueChange={setApiSecret}
									/>
								</Field>
								<Field data-orientation="vertical">
									<FieldLabel htmlFor="ai-secret">Model Used</FieldLabel>
									<FieldControl
										id="ai-model"
										type="text"
										placeholder="Enter the model name"
										value={selectedRemoteModel}
										onValueChange={setSelectedRemoteModel}
									/>
									<FieldDescription>E.g. gpt-5.3</FieldDescription>
								</Field>
							</>
						)}
						{aiProvider === "local" && (
							<>
								<Field data-orientation="vertical">
									<FieldLabel htmlFor="ollama-model">Ollama Model</FieldLabel>
									<Select
										id="ollama-model"
										value={selectedLocalModel}
										onChange={(e) => setSelectedLocalModel(e.target.value)}
										disabled={loadingModels}
									>
										{availableModels.map((model) => (
											<option key={model} value={model}>
												{model}
											</option>
										))}
									</Select>
									<FieldDescription>
										Using local Ollama server at{" "}
										<code>http://localhost:11434</code>
									</FieldDescription>
									{fetchModelError && (
										<FieldErrorDescription>
											{fetchModelError}
										</FieldErrorDescription>
									)}
								</Field>
								<Button
									type="button"
									variant="outline"
									onClick={refreshOllamaStatus}
									disabled={loadingModels}
								>
									{loadingModels ? "Refreshing..." : "Refresh Models"}
								</Button>
							</>
						)}
					</FormContainer>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={savingConfig}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={savingConfig}>
							{savingConfig ? "Saving..." : "Save changes"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
