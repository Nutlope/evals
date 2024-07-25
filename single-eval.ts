import { Eval } from 'braintrust';
import { Factuality } from 'autoevals';
import Together from 'together-ai';
import { dataset } from './evalDataset';

const together = new Together();

const EvalDataSet = dataset.map((row) => ({
  input: row.instruction,
  expected: row.output,
}));

async function main() {
  Eval('mathinstruct', {
    data: () =>
      EvalDataSet.map(({ input, expected }) => ({
        input,
        expected,
      })),
    task: async (input) => {
      let mathAnswer = await together.chat.completions.create({
        model: 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo', // Replace this with any serverless or finetuned model
        messages: [
          {
            role: 'system',
            content: "You're a helpful assistant that answers math problems.",
          },
          { role: 'user', content: input },
        ],
        max_tokens: 1500,
      });

      return mathAnswer?.choices?.[0]?.message?.content ?? '';
    },
    scores: [Factuality],
    experimentName: 'Llama 3.1 405B',
    maxConcurrency: 4,
  });
}

main();
