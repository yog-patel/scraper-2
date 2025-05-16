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
   "https://www.mvlempyr.com/novel/paladin-of-the-dead-god",
    "https://www.mvlempyr.com/novel/pale-lights",
    "https://www.mvlempyr.com/novel/pampered-by-all-in-different-planes",
    "https://www.mvlempyr.com/novel/pampered-poisonous-royal-wife",
    "https://www.mvlempyr.com/novel/paradise-of-demonic-gods",
    "https://www.mvlempyr.com/novel/paragon-of-sin",
    "https://www.mvlempyr.com/novel/parallel",
    "https://www.mvlempyr.com/novel/parallel-memory",
    "https://www.mvlempyr.com/novel/parallel-world-pharmacy",
    "https://www.mvlempyr.com/novel/parasite-gu-breeding-longveity-path-starting-from-the-love-enamored-gu",
    "https://www.mvlempyr.com/novel/passerby-villain-in-a-wizard-world",
    "https://www.mvlempyr.com/novel/past-life-returner",
    "https://www.mvlempyr.com/novel/past-life-sage-this-life-a-dual-cultivator",
    "https://www.mvlempyr.com/novel/path-of-absolute-transcendence",
    "https://www.mvlempyr.com/novel/path-of-dragons",
    "https://www.mvlempyr.com/novel/path-of-the-extra",
    "https://www.mvlempyr.com/novel/path-to-becoming-the-greatest-space-mercenary",
    "https://www.mvlempyr.com/novel/path-to-transcendence",
    "https://www.mvlempyr.com/novel/peerless-little-immortal-doctor",
    "https://www.mvlempyr.com/novel/peerless-martial-god",
    "https://www.mvlempyr.com/novel/perfect-secret-love-the-bad-new-wife-is-a-little-sweet",
    "https://www.mvlempyr.com/novel/perfect-world",
    "https://www.mvlempyr.com/novel/perverted-daddy-system",
    "https://www.mvlempyr.com/novel/perverted-demon",
    "https://www.mvlempyr.com/novel/pestilence-rise-of-the-pure-undead",
    "https://www.mvlempyr.com/novel/phoenix-phire",
    "https://www.mvlempyr.com/novel/picking-up-a-general-to-plow-the-fields",
    "https://www.mvlempyr.com/novel/picking-up-fragments",
    "https://www.mvlempyr.com/novel/picking-up-girls-with-my-system",
    "https://www.mvlempyr.com/novel/pivot-of-the-sky",
    "https://www.mvlempyr.com/novel/plague-doctor",
    "https://www.mvlempyr.com/novel/playboy-cultivator-in-the-apocalypse",
    "https://www.mvlempyr.com/novel/player-who-returned-10-000-years-later",
    "https://www.mvlempyr.com/novel/playing-waterbending-avatar-last-aibender-si",
    "https://www.mvlempyr.com/novel/please-confess-to-me",
    "https://www.mvlempyr.com/novel/poison-genius-consort",
    "https://www.mvlempyr.com/novel/poison-gods-heritage",
    "https://www.mvlempyr.com/novel/poisoning-the-world-the-secret-service-mysterious-doctor-is-a-young-beastly-wife",
    "https://www.mvlempyr.com/novel/pokemon---a-real-story",
    "https://www.mvlempyr.com/novel/pokemon-a-new-path",
    "https://www.mvlempyr.com/novel/pokemon-trainer-vicky",
    "https://www.mvlempyr.com/novel/possessing-nothing",
    "https://www.mvlempyr.com/novel/post-mythical-era-i-dont-want-to-die-in-the-third-reincarnation",
    "https://www.mvlempyr.com/novel/praise-the-orc",
    "https://www.mvlempyr.com/novel/predatory-marriage",
    "https://www.mvlempyr.com/novel/president-qins-little-wife-is-the-strongest",
    "https://www.mvlempyr.com/novel/prestige-grinding-i-can-reset-my-level",
    "https://www.mvlempyr.com/novel/pretending-to-be-a-boss",
    "https://www.mvlempyr.com/novel/pretending-to-be-an-untouchable-crime-boss",
    "https://www.mvlempyr.com/novel/prime-originator",
    "https://www.mvlempyr.com/novel/primitive-man",
    "https://www.mvlempyr.com/novel/primordial-chaos-dragon-tower-harem-system",
    "https://www.mvlempyr.com/novel/primordial-dimensions",
    "https://www.mvlempyr.com/novel/primordial-draconic-incubus-with-a-gourmet-chef-system",
    "https://www.mvlempyr.com/novel/primordial-dual-cultivator-dragon-with-system",
    "https://www.mvlempyr.com/novel/primordial-expanse-i-have-the-strongest-talent",
    "https://www.mvlempyr.com/novel/primordial-harem-system",
    "https://www.mvlempyr.com/novel/primordial-sin-system",
    "https://www.mvlempyr.com/novel/primordial-souls-rebirth",
    "https://www.mvlempyr.com/novel/primordial-star-scripture",
    

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
