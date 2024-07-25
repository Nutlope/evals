import { Eval } from 'braintrust';
import { Factuality } from 'autoevals';
import Together from 'together-ai';

const together = new Together();

Eval('llama3.1-finetuning', {
  data: () => {
    return [
      {
        input:
          "I went to the music shop and there were CDs of The Life Journey for $100, A Day a Life for $50, and When You Rescind for $85 on display. If I bought 3 of each CD to share with my friends, what's the total amount of money I spent in the shop?",
        expected:
          'The total cost of The Life Journey is 3 \u00d7 $100 = $300.\nThe total cost of When You Rescind is 3 \u00d7 $85 = $255.\nThe total cost of A Day a Life is 3 \u00d7 $50 = $150.\nThe total cost for all the CDs is $150 + $255 + $300 = $705.\nThe answer is 705',
      },
    ];
  },
  task: async (input) => {
    const mathAnswer = await together.chat.completions.create({
      model:
        'hassan@together.ai/Meta-Llama-3.1-8B-Instruct-Reference-3.1-MathInstruct-261k-2024-07-23-22-06-02-bf3f37b7',
      messages: [{ role: 'user', content: input }],
    });
    return mathAnswer?.choices?.[0]?.message?.content ?? '';
  },
  scores: [Factuality],
});
