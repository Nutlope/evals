import { Eval } from 'braintrust';
import { Factuality } from 'autoevals';
import Together from 'together-ai';
import OpenAI from 'openai';
import { dataset } from './mathInstructDataset';

const together = new Together();
const openai = new OpenAI();

const EvalDataSet = dataset.map((row) => ({
  input: row.instruction,
  expected: row.output,
}));

const endpoints = [
  {
    model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
    client: 'together',
    name: 'Llama 3.1 8B Instruct',
  },
  {
    model: 'gpt-4o',
    client: 'openai',
    name: 'OpenAI GPT-4o',
  },
  {
    model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
    client: 'together',
    name: 'Llama 3.1 70B Instruct',
  },
];

async function main() {
  await Promise.all(
    endpoints.map(async (endpoint) => {
      Eval('mathinstruct', {
        data: () =>
          EvalDataSet.map(({ input, expected }) => ({
            input,
            expected,
          })),
        task: async (input) => {
          let mathAnswer;
          if (endpoint.client === 'together') {
            mathAnswer = await together.chat.completions.create({
              model: endpoint.model,
              messages: [
                {
                  role: 'system',
                  content:
                    "You're a helpful assistant that answers math problems.",
                },
                { role: 'user', content: input },
              ],
              max_tokens: 1500,
            });
          } else {
            mathAnswer = await openai.chat.completions.create({
              model: endpoint.model,
              messages: [
                {
                  role: 'system',
                  content:
                    "You're a helpful assistant that answers math problems.",
                },
                { role: 'user', content: input },
              ],
            });
          }
          return mathAnswer?.choices?.[0]?.message?.content ?? '';
        },
        scores: [Factuality],
        experimentName: endpoint.name,
      });
    })
  );
}

main();
