# Running evals

This is a repo that shows how to run evals on models from Together AI with Braintrust.

## Running this locally

1. Clone the repo with git clone & run `npm install` to install all dependencies
2. Create an account with Together AI and Braintrust, and add your API keys to `.env` file
3. Define your eval dataset in `evalDataset.ts`
4. Run `ts-node single-eval.ts` to run some evals (or `ts-node multi-evals.ts` for multiple)
