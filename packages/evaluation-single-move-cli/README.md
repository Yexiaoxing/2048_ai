# 2048 Single Move LLM Evaluation

This package evaluates how often an AI model agrees with algorithm-labeled best moves for 2048 boards.

## What It Does

For each sample in a dataset, the evaluator:

1. Loads a board and expected move label from JSON.
2. Asks an AI model for its best move on that board.
3. Compares AI move vs labeled move and records alignment.

It then reports alignment metrics and writes a detailed JSON result file.

## Dataset Format

Default dataset path:

- `dataset/output/game_states.json`

Each row must contain:

- `board`: 4x4 board array
- one label field (for example `bestMoveExpectimax`, `bestMoveMinimax`, or `bestMove`)

Label values can be:

- numeric direction enum (`0..3`)
- string direction (`"up"`, `"down"`, `"left"`, `"right"`)

## Run

From this package directory:

```bash
pnpm start
```

Or provide a config file path:

```bash
pnpm start ./config.openai.json
```

## Config

The evaluator reads JSON config from the first CLI argument.
If no path is provided, it tries `config.ollama.json`, then falls back to built-in defaults.

Supported fields:

```json
{
  "models": [
    {
      "name": "gemma4:e4b",
      "type": "ollama",
      "path": "gemma4:e4b"
    },
    {
      "name": "GPT-4o-Mini",
      "type": "openai",
      "apiModelName": "gpt-4o-mini",
      "apiEndpoint": "https://api.openai.com/v1/chat/completions",
      "apiKey": "YOUR_OPENAI_API_KEY"
    }
  ],
  "datasetPath": "dataset/output/game_states.json",
  "labelField": "bestMoveExpectimax",
  "limit": 200,
  "shuffle": false,
  "resultsFile": "results/single_move_eval_results.json"
}
```

Notes:

- `labelField` selects which algorithm label to compare against.
- If `labelField` is missing in a row, evaluator falls back to `bestMove`, then `bestMoveExpectimax`, then `bestMoveMinimax`.
- For OpenAI, `apiKey` can be omitted if `OPENAI_API_KEY` is set.

## Output

Console summary per model:

- aligned count
- evaluated count
- alignment rate
- failure count

JSON output includes per-example records:

- expected move
- AI move
- aligned boolean
- optional error message
