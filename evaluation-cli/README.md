# 2048 LLM Agent Evaluation CLI

A command-line tool to evaluate LLM agents playing 2048 with TUI (Terminal User Interface) visualization support.

## Installation

```bash
// run install from root first to setup shared packages

cd evaluation-cli
pnpm install
```

## Configuration

Create a JSON configuration file (see examples):

### Ollama Configuration (`config.json`)

```json
{
  "models": [
    {
      "name": "gemma4:e4b",
      "type": "ollama",
      "path": "gemma4:e4b"
    }
  ],
  "numRuns": 20,
  "maxGameMoves": 2000,
  "visualize": false,
  "visualizeDelayMs": 750,
  "resultsFile": "2048_evaluation_results.csv",
  "style": "classic"
}
```

### OpenAI Configuration

```json
{
  "models": [
    {
      "name": "GPT-4o-Mini",
      "type": "openai",
      "apiModelName": "gpt-4o-mini",
      "baseUrl": "https://api.openai.com/v1",
      "apiKey": "YOUR_API_KEY"
    }
  ],
  "numRuns": 20,
  "visualize": false,
  "style": "classic"
}
```

## Usage

### Run with Configuration File

```bash
pnpm run start -- config.json
```

## Configuration Options

| Option              | Type    | Description                              | Default                                                            |
| ------------------- | ------- | ---------------------------------------- | ------------------------------------------------------------------ |
| `models`            | Array   | LLM model configurations                 | `[{"name": "gemma4:e4b", "type": "ollama", "path": "gemma4:e4b"}]` |
| `numRuns`           | Number  | Number of games to play per model        | `20`                                                               |
| `maxGameMoves`      | Number  | Maximum moves per game (safety limit)    | `2000`                                                             |
| `visualize`         | Boolean | Show TUI visualization                   | `false`                                                            |
| `visualizeDelayMs`  | Number  | Delay between visualization updates (ms) | `750`                                                              |
| `resultsFile`       | String  | CSV file to log results                  | `2048_evaluation_results.csv`                                      |
| `statsFile`         | String  | JSON file to log aggregated stats        | `2048_evaluation_stats.json`                                      |
| `style`             | String  | TUI style: `classic` or `dark`           | `classic`                                                          |

## Model Configuration Samples

### Ollama

```json
{
  "name": "Model Name",
  "type": "ollama",
  "path": "model:tag",
}
```

**Requirements:**

- Ollama running locally
- Model pulled: `ollama pull model:tag`

### OpenAI Compatible APIs

```json
{
  "name": "Model Name",
  "type": "openai",
  "apiModelName": "model-id-in-api",
  "baseUrl": "https://api.example.com/v1",
  "apiKey": "sk-..." // or set OPENAI_API_KEY env var
}
```

Make sure you use a valid OpenAI-compatible model and have the correct API key and endpoint configured.

## Output

### Console Output

- Progress bar with game counter
- Summary statistics per model
- Error messages and warnings

### Results CSV File

Columns include:

- `timestamp`: When the game was played
- `modelName`: Name of the model
- `gameId`: Unique seed for reproducibility
- `maxTileAchieved`: Highest tile reached
- `finalScore`: Final score
- `numMoves`: Number of moves made
- `win`: Whether the model reached 2048
- `durationSeconds`: Game duration
- `error`: Any error message

## Examples

### Single Model Benchmark

```bash
echo '{
  "models": [{"name": "gemma4:e4b", "type": "ollama", "path": "gemma4:e4b"}],
  "numRuns": 50,
  "visualize": false
}' > config-bench.json

pnpm run start -- config-bench.json
```

### Compare Multiple Models

```bash
echo '{
  "models": [
    {"name": "gemma4:e4b", "type": "ollama", "path": "gemma4:e4b"},
    {"name": "qwen3.5:9b", "type": "ollama", "path": "qwen3.5:9b"}
  ],
  "numRuns": 20
}' > config-compare.json

pnpm run start -- config-compare.json
```

### With Visualization

```bash
echo '{
  "models": [{"name": "gemma4:e4b", "type": "ollama", "path": "gemma4:e4b"}],
  "numRuns": 5,
  "visualize": true,
  "visualizeDelayMs": 500
}' > config-viz.json

pnpm run start -- config-viz.json
```
