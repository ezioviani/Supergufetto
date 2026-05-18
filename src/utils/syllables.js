export function divideInSillabe(text) {
  return text
    .toLowerCase()
    .replace(/[^a-zàèéìòóù\s]/gi, '')
    .split(' ')
    .flatMap(word => {
      const sillabe = word.match(/[^aeiou]*[aeiou]+(?:[^aeiou]+(?=[^aeiou]|$))?/g)
      return sillabe || []
    })
}
