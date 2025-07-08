// Function to calculate similarity between two strings
const calculateSimilarity = (str1, str2) => {
  if (!str1 || !str2) return 0;
  
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  // If strings are identical, return 1
  if (s1 === s2) return 1;
  
  // If one string is contained in the other, return high similarity
  if (s1.includes(s2) || s2.includes(s1)) {
    return 0.9;
  }
  
  // Calculate word overlap
  const words1 = new Set(s1.split(/\s+/));
  const words2 = new Set(s2.split(/\s+/));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
};

// Function to check if two articles are similar
const areArticlesSimilar = (article1, article2, similarityThreshold = 0.7) => {
  // Check title similarity
  const titleSimilarity = calculateSimilarity(article1.title, article2.title);
  if (titleSimilarity > similarityThreshold) return true;
  
  // Check description similarity
  const descSimilarity = calculateSimilarity(article1.description, article2.description);
  if (descSimilarity > similarityThreshold) return true;
  
  // Check if they have the same source and very similar titles
  if (article1.source_id === article2.source_id && titleSimilarity > 0.5) return true;
  
  return false;
};

// Function to filter unique articles
export const filterUniqueArticles = (articles, similarityThreshold = 0.7) => {
  if (!articles || articles.length === 0) return [];
  
  const uniqueArticles = [];
  const seenArticles = new Set();
  
  for (const article of articles) {
    let isDuplicate = false;
    
    // Check against already processed articles
    for (const uniqueArticle of uniqueArticles) {
      if (areArticlesSimilar(article, uniqueArticle, similarityThreshold)) {
        isDuplicate = true;
        break;
      }
    }
    
    // Create a unique identifier for this article
    const articleId = `${article.title}-${article.source_id}-${article.link}`;
    
    // Check if we've seen this exact article before
    if (seenArticles.has(articleId)) {
      isDuplicate = true;
    }
    
    if (!isDuplicate) {
      uniqueArticles.push(article);
      seenArticles.add(articleId);
    }
  }
  
  return uniqueArticles;
};

// Function to group articles by similarity for debugging
export const groupSimilarArticles = (articles, similarityThreshold = 0.7) => {
  const groups = [];
  const processed = new Set();
  
  for (let i = 0; i < articles.length; i++) {
    if (processed.has(i)) continue;
    
    const group = [articles[i]];
    processed.add(i);
    
    for (let j = i + 1; j < articles.length; j++) {
      if (processed.has(j)) continue;
      
      if (areArticlesSimilar(articles[i], articles[j], similarityThreshold)) {
        group.push(articles[j]);
        processed.add(j);
      }
    }
    
    if (group.length > 1) {
      groups.push(group);
    }
  }
  
  return groups;
};

// Function to get article fingerprint for more accurate deduplication
export const getArticleFingerprint = (article) => {
  const title = article.title?.toLowerCase().trim() || '';
  const source = article.source_id?.toLowerCase().trim() || '';
  const url = article.link?.toLowerCase().trim() || '';
  
  // Create a simple hash-like fingerprint
  return `${title.substring(0, 50)}-${source}-${url.substring(0, 30)}`;
}; 