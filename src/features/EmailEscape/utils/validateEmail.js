export const validateUsername = (username) => {
  if (!username || username.trim() === "") return false;
  const usernameRegex = /^[a-zA-Z0-9._-]+$/; // lettres, chiffres, . _ -
  return usernameRegex.test(username.trim());
};

export const validateDomain = (domain) => {
  if (!domain || domain.trim() === "") return false;
  // Accepte sous-domaines et extensions, ex: gmail.com, mail.example.co.uk
  const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return domainRegex.test(domain.trim());
};
export const isEmailComplete = (username, domain) => {
  return validateUsername(username) && validateDomain(domain);
};