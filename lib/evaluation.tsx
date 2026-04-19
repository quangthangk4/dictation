import React from 'react'

const cleanWord = (word: string) => word.toLowerCase().replace(/['’‘]/g, "'").replace(/^[.,!?;:"()]+|[.,!?;:"()]+$/g, '')

export function getEvaluatedSentence(targetSentence: string, userSentence: string) {
  const targetWords = targetSentence.split(/\s+/).filter(Boolean);
  const userWords = userSentence.split(/\s+/).filter(Boolean);

  // We want to map each target word to 'correct', 'incorrect' (red), or 'missing' (yellow).
  // dp[i][j] stores the min operations to match targetWords[0..i] with userWords[0..j]
  const dp: number[][] = [];
  for (let i = 0; i <= targetWords.length; i++) {
    dp[i] = [];
    for (let j = 0; j <= userWords.length; j++) {
      dp[i][j] = 0;
    }
  }

  for (let i = 0; i <= targetWords.length; i++) dp[i][0] = i;
  for (let j = 0; j <= userWords.length; j++) dp[0][j] = j;

  for (let i = 1; i <= targetWords.length; i++) {
    for (let j = 1; j <= userWords.length; j++) {
      const tc = cleanWord(targetWords[i - 1]);
      const uc = cleanWord(userWords[j - 1]);
      const isMatch = tc === uc || tc + 's' === uc || tc === uc + 's';
      
      if (isMatch) {
        dp[i][j] = dp[i - 1][j - 1]; // cost 0
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,    // delete target word (missed)
          dp[i][j - 1] + 1,    // insert user word (extra typed)
          dp[i - 1][j - 1] + 1 // substitute (incorrect)
        );
      }
    }
  }

  const result: { word: string; status: 'green' | 'red' | 'yellow' }[] = new Array(targetWords.length);
  let i = targetWords.length;
  let j = userWords.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const tc = cleanWord(targetWords[i - 1]);
      const uc = cleanWord(userWords[j - 1]);
      const isMatch = tc === uc || tc + 's' === uc || tc === uc + 's';

      if (isMatch && dp[i][j] === dp[i - 1][j - 1]) {
        result[i - 1] = { word: targetWords[i - 1], status: 'green' };
        i--;
        j--;
      } else if (dp[i][j] === dp[i - 1][j - 1] + 1) { // substitution
        result[i - 1] = { word: targetWords[i - 1], status: 'red' };
        i--;
        j--;
      } else if (dp[i][j] === dp[i - 1][j] + 1) { // Target present, User missed it -> delete
        result[i - 1] = { word: targetWords[i - 1], status: 'yellow' };
        i--;
      } else if (dp[i][j] === dp[i][j - 1] + 1) { // User added word -> insert
        // Insertions are ignored in final output since we only display target words
        j--;
      }
    } else if (i > 0) {
      result[i - 1] = { word: targetWords[i - 1], status: 'yellow' };
      i--;
    } else if (j > 0) {
      j--;
    }
  }

  return result;
}

export function RenderEvaluatedWords({ targetSentence, userSentence, size = 'md' }: { targetSentence: string, userSentence: string, size?: 'sm' | 'md' }) {
  const evaluated = getEvaluatedSentence(targetSentence, userSentence);

  const textSize = size === 'sm' ? 'text-base' : 'text-lg'
  const marginSize = size === 'sm' ? 'mr-1 mb-1' : 'mr-1.5 mb-1.5'

  return (
    <>
      {evaluated.map((item, i) => {
        let colorClass = ''
        if (item.status === 'green') {
          colorClass = 'text-green-700 font-semibold'
        } else if (item.status === 'yellow') {
          colorClass = `text-yellow-700 font-bold bg-yellow-100/80 px-1 ${size === 'sm' ? 'py-0.25' : 'py-0.5'} rounded-md border border-yellow-200`
        } else if (item.status === 'red') {
          colorClass = `text-red-700 font-bold bg-red-100/80 px-1 ${size === 'sm' ? 'py-0.25' : 'py-0.5'} rounded-md border border-red-200`
        }

        return (
          <span key={i} className={`inline-flex gap-1 ${marginSize}`}>
            <span className={`${textSize} ${colorClass}`}>
              {item.word}
            </span>
          </span>
        )
      })}
    </>
  )
}
