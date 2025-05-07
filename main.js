// // main.js
// const { launchBrowser } = require("./browser");
// const { scrapeNovelDetails, scrapeChapters } = require("./scraper");
// const { 
//   insertNovel, 
//   insertChapters, 
//   checkNovelExists,
//   getLatestChapterNumber,
//   closeDbConnection
// } = require("./DatabaseOperations");

// // Main execution function
// async function main() {
//     const url = "https://www.mvlempyr.com/novel/reawakening-sss-rank-villains-pov"; // Target URL
//     const browser = await launchBrowser();
//     const page = await browser.newPage();
    
//     try {
//         // Set up the page
//         await page.setUserAgent(
//             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
//         );
//         await page.goto(url, { waitUntil: "networkidle2" });

//         // Scrape novel details
//         const novelData = await scrapeNovelDetails(page);
//         console.log("Novel information:", novelData);

//         if (!novelData.title || !novelData.author) {
//             console.log("Missing essential novel data (title or author). Exiting.");
//             return;
//         }

//         // Store novel in database or get existing ID
//         const novelId = await insertNovel({
//             title: novelData.title,
//             author: novelData.author,
//             description: novelData.synopsis,
//             cover_image_url: novelData.imageLink,
//             tags: novelData.tags,
//             genres: novelData.genres,
//             status: novelData.status,
//         });

//         if (!novelId) {
//             console.log("Failed to process novel data. Exiting.");
//             return;
//         }

//         // Get latest chapter from DB to determine how many chapters to scrape
//         const latestChapterNumber = await getLatestChapterNumber(novelId);
//         console.log(`Current chapters in database: ${latestChapterNumber}`);
//         console.log(`Total chapters on site: ${novelData.numOfCh}`);

//         if (latestChapterNumber >= novelData.numOfCh) {
//             console.log("Novel is already up to date. No new chapters to scrape.");
//             return;
//         }

//         // Calculate how many new chapters to scrape
//         const chaptersToScrape = novelData.numOfCh - latestChapterNumber;
//         console.log(`Need to scrape ${chaptersToScrape} new chapters.`);

//         // Scrape chapters (only the new ones)
//         // If no chapters exist, scrape all. Otherwise, scrape only new chapters
//         const scrapedChapters = await scrapeChapters(page, novelData.numOfCh, latestChapterNumber);
//         console.log(`Total new chapters scraped: ${scrapedChapters.length}`);

//         // Store new chapters in database
//         if (scrapedChapters.length > 0) {
//             const newChaptersCount = await insertChapters(novelId, scrapedChapters);
//             console.log(`${newChaptersCount} new chapters stored in database with Novel ID: ${novelId}`);
//         } else {
//             console.log("No new chapters to store.");
//         }

//     } catch (error) {
//         console.error("Error during scraping:", error);
//     } finally {
//         // Close browser when done
//         await browser.close();
//         // Close database connection
//         await closeDbConnection();
//         console.log("Scraping process completed");
//     }
// }

// // Execute the main function
// main().catch(console.error);

// main.js
const { launchBrowser } = require("./browser");
const { scrapeNovelDetails, scrapeChapters } = require("./scraper");
const { 
  insertNovel, 
  insertChapters, 
  checkNovelExists,
  getLatestChapterNumber,
  closeDbConnection
} = require("./DatabaseOperations");

// Main execution function
async function main() {

    const urls = [
        "https://www.mvlempyr.com/novel/reawakening-sss-rank-villains-pov",
        "https://www.mvlempyr.com/novel/extras-death-i-am-the-son-of-hades",
        "https://www.mvlempyr.com/novel/struggling-as-a-villain",
        "https://www.mvlempyr.com/novel/third-rebirth-godsfall-apocalypse",
        "https://www.mvlempyr.com/novel/i-was-mistaken-for-the-reincarnated-evil-overlord",
        "https://www.mvlempyr.com/novel/worldcrafter---building-my-underground-kingdom",
        "https://www.mvlempyr.com/novel/daily-life-of-a-cultivation-judge",
        "https://www.mvlempyr.com/novel/antagonist-protection-service",
        "https://www.mvlempyr.com/novel/extra-to-protagonist",
        "https://www.mvlempyr.com/novel/reincarnated-as-an-elf-prince",
        "https://www.mvlempyr.com/novel/my-talents-name-is-generator",
        "https://www.mvlempyr.com/novel/becoming-the-strongest-as-a-game-dev",
        "https://www.mvlempyr.com/novel/evolution-of-the-ruined-heir",
        "https://www.mvlempyr.com/novel/ascension-of-the-dark-seraph",
        "https://www.mvlempyr.com/novel/zombie-apocalypse-reborn-with-a-farming-space",
        "https://www.mvlempyr.com/novel/the-glitched-mage",
        "https://www.mvlempyr.com/novel/strongest-demigod-system",
        "https://www.mvlempyr.com/novel/magus-supremacy",
        "https://www.mvlempyr.com/novel/how-to-survive-in-the-roanoke-colony",
        "https://www.mvlempyr.com/novel/godly-revival-system-i-buy-my-killers-stats",
        "https://www.mvlempyr.com/novel/rebirth-slice-of-life-cultivation",
        "https://www.mvlempyr.com/novel/i-accidentally-became-a-superstar",
        "https://www.mvlempyr.com/novel/the-abyssal-garden-no-room-for-the-idle",
        "https://www.mvlempyr.com/novel/from-abyssal-invasion-to-bursting-stars-with-a-single-sword",
        "https://www.mvlempyr.com/novel/ex-rank-talent-awakening-100-dodge-rate",
        "https://www.mvlempyr.com/novel/multiversal-livestreaming-system-i-can-copy-my-viewers-skills",
        "https://www.mvlempyr.com/novel/the-villains-pov",
        "https://www.mvlempyr.com/novel/i-slaughtered-through-the-dungeon-worlds-with-my-cheats",
        "https://www.mvlempyr.com/novel/wizard-i-can-refine-everything",
        "https://www.mvlempyr.com/novel/i-become-a-martial-arts-god-in-the-chaotic-demon-world",
        "https://www.mvlempyr.com/novel/1-lifesteal",
        "https://www.mvlempyr.com/novel/10-nen-goshi-no-hikiniito-o-yamete-gaishutsushitara-jitaku-goto-isekai-ni-tenishiteta",
        "https://www.mvlempyr.com/novel/100-000-hour-professional-stand-in",
        "https://www.mvlempyr.com/novel/100-days-to-seduce-the-devil",
        "https://www.mvlempyr.com/novel/108-maidens-of-destiny",
        "https://www.mvlempyr.com/novel/10x-cashback-your-wealth-is-mine",
        "https://www.mvlempyr.com/novel/21st-century-necromancer",
        "https://www.mvlempyr.com/novel/48-hours-a-day",
        "https://www.mvlempyr.com/novel/500th-time-reborn-a-world-only-known-by-women-the-karma-system",
        "https://www.mvlempyr.com/novel/a-certain-middle-aged-mans-vrmmo-activity-log",
        "https://www.mvlempyr.com/novel/a-crowd-of-evil-spirit-lines-up-to-confess-to-me",
        "https://www.mvlempyr.com/novel/a-demon-lords-tale-dungeons-monster-girls-and-heartwarming-bliss",
        "https://www.mvlempyr.com/novel/a-fairy-tales-for-the-villains",
        "https://www.mvlempyr.com/novel/a-farmers-journey-to-immortality",
        "https://www.mvlempyr.com/novel/a-filthy-rich-hamster-in-the-apocalypse",
        "https://www.mvlempyr.com/novel/a-gunslingers-system-in-a-world-of-magic",
        "https://www.mvlempyr.com/novel/a-journey-of-black-and-red",
        "https://www.mvlempyr.com/novel/a-journey-that-changed-the-world",
        "https://www.mvlempyr.com/novel/a-knight-who-eternally-regresses",
        "https://www.mvlempyr.com/novel/a-mistaken-marriage-match-a-generation-of-military-counselor",
      ];

    const browser = await launchBrowser();

    try {
        for (let url of urls) {
            console.log(`Scraping novel from URL: ${url}`);
            const page = await browser.newPage();

            try {
                // Set up the page
                await page.setUserAgent(
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                );
                await page.goto(url, { waitUntil: "networkidle2" });

                // // Scrape novel details
                // const novelData = await scrapeNovelDetails(page);
                // console.log("Novel information:", novelData);

                // if (!novelData.title || !novelData.author) {
                //     console.log("Missing essential novel data (title or author). Exiting.");
                //     continue;  // Skip this novel and move to the next one
                // }

                // // Store novel in database or get existing ID
                // const novelId = await insertNovel({
                //     title: novelData.title,
                //     author: novelData.author,
                //     description: novelData.synopsis,
                //     cover_image_url: novelData.imageLink,
                //     tags: novelData.tags,
                //     genres: novelData.genres,
                //     status: novelData.status,
                // });

                // if (!novelId) {
                //     console.log("Failed to process novel data. Skipping.");
                //     continue;  // Skip this novel and move to the next one
                // }

                // // Get latest chapter from DB to determine how many chapters to scrape
                // const latestChapterNumber = await getLatestChapterNumber(novelId);
                // console.log(`Current chapters in database: ${latestChapterNumber}`);
                // console.log(`Total chapters on site: ${novelData.numOfCh}`);

                // if (latestChapterNumber >= novelData.numOfCh) {
                //     console.log("Novel is already up to date. No new chapters to scrape.");
                //     continue;  // Skip this novel and move to the next one
                // }

                // // Calculate how many new chapters to scrape
                // const chaptersToScrape = novelData.numOfCh - latestChapterNumber;
                // console.log(`Need to scrape ${chaptersToScrape} new chapters.`);

                // // Scrape chapters (only the new ones)
                // const scrapedChapters = await scrapeChapters(page, novelData.numOfCh, latestChapterNumber);
                // console.log(`Total new chapters scraped: ${scrapedChapters.length}`);

                // Scrape novel details
        const novelData = await scrapeNovelDetails(page);
        console.log("Novel information:", novelData);

        if (!novelData.title || !novelData.author) {
            console.log("Missing essential novel data (title or author). Exiting.");
            continue;  // Skip this novel and move to the next one
        }

        // Store novel in database or get existing ID
        const novelId = await insertNovel({
            title: novelData.title,
            author: novelData.author,
            description: novelData.synopsis,
            cover_image_url: novelData.imageLink,
            tags: novelData.tags,
            genres: novelData.genres,
            status: novelData.status,
        });

        if (!novelId) {
            console.log("Failed to process novel data. Skipping.");
            continue;  // Skip this novel and move to the next one
        }

        // Get latest chapter from DB to determine how many chapters to scrape
        const latestChapterNumber = await getLatestChapterNumber(novelId);
        
        // Use the most reliable chapter count - prefer numOfCh but fall back to chapters
        // if numOfCh is zero
        const totalChapters = novelData.numOfCh || parseInt(novelData.chapters) || 0;
        
        console.log(`Current chapters in database: ${latestChapterNumber}`);
        console.log(`Total chapters on site: ${totalChapters}`);

        if (latestChapterNumber >= totalChapters || totalChapters === 0) {
            console.log("Novel is already up to date or no chapters found. Skipping.");
            continue;  // Skip this novel and move to the next one
        }

        // Calculate how many new chapters to scrape
        const chaptersToScrape = totalChapters - latestChapterNumber;
        console.log(`Need to scrape ${chaptersToScrape} new chapters.`);

        // Scrape chapters (only the new ones)
        const scrapedChapters = await scrapeChapters(page, totalChapters, latestChapterNumber);
        console.log(`Total new chapters scraped: ${scrapedChapters.length}`);

                // Store new chapters in database
                if (scrapedChapters.length > 0) {
                    const newChaptersCount = await insertChapters(novelId, scrapedChapters);
                    console.log(`${newChaptersCount} new chapters stored in database with Novel ID: ${novelId}`);
                } else {
                    console.log("No new chapters to store.");
                }

            } catch (error) {
                console.error(`Error during scraping URL: ${url}`, error);
            } finally {
                // Close the page after scraping
                await page.close();
            }
        }

    } catch (error) {
        console.error("Error during scraping process:", error);
    } finally {
        // Close browser when done
        await browser.close();
        // Close database connection
        await closeDbConnection();
        console.log("Scraping process completed");
    }
}

// Execute the main function
main().catch(console.error);
