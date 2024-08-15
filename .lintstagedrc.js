module.exports = {
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write',
    'npm test -- --findRelatedTests --passWithNoTests',
  ],
  '*.{json,md}': ['prettier --write'],
};
