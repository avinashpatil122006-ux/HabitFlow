/**
 * HabitFlow - Quotes Module
 * Database of motivational quotes.
 */

const QUOTES = [
    { text: "The secret of your future is hidden in your daily routine.", author: "Mike Murdock" },
    { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
    { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
    { text: "Your net worth to the world is usually determined by what remains after your bad habits are subtracted from your good ones.", author: "Benjamin Franklin" },
    { text: "First we make our habits, then our habits make us.", author: "John Dryden" },
    { text: "Successful people are simply those with successful habits.", author: "Brian Tracy" },
    { text: "Consistency is better than perfection.", author: "Unknown" },
    { text: "Small habits make a big difference.", author: "James Clear" },
    { text: "You will never change your life until you change something you do daily.", author: "John C. Maxwell" }
];

document.addEventListener('DOMContentLoaded', () => {
    const quoteText = document.getElementById('daily-quote');
    const quoteAuthor = document.getElementById('quote-author');
    
    if (quoteText && quoteAuthor) {
        const randomIndex = Math.floor(Math.random() * QUOTES.length);
        const quote = QUOTES[randomIndex];
        
        quoteText.textContent = `"${quote.text}"`;
        quoteAuthor.textContent = quote.author;
    }
});
