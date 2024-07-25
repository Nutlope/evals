# Running evals

This is a repo that shows how to run evals on models from Together AI & OpenAI with Braintrust.

## Running this locally

1. Clone the repo locally with `git clone`
2. Run `pip install together openai braintrust autoevals`
3. Define your eval dataset in `evalDataset.ts`
4. Run `python single-eval.ts` to run some evals (or `python multi-evals.ts` for multiple)
