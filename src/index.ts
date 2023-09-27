
// // Create Pagination 
// const scraper = new Scraper();
// async function get_links() {
//     let counter: number = 0
//     let product_links: any = []

//     while (true) {
//         counter += 1
//         if (counter === 22) {
//             break
//         }

//         product_links.push(
//             await scraper.get_links(`https://www.trendyol.com/sr?wg=1&wc=101465&prc=1000-*&mb=kurumsal_satici%2Cbasarili_satici%2Cyetkili_satici&q=%C3%87apraz+%C3%87anta&pi=${counter-1}`)
//         )

//     }
//     const flat_link:any = Array.prototype.concat.apply([], product_links)
//     fs.writeFileSync('product_links.txt', flat_link.join('\n'));
// }


// async function get_detail() {
//     const jsonData: any[] = [];
//     const productLinks = fs.readFileSync('product_links.txt', 'utf-8').split(/\r?\n/);

//     for (const url of productLinks) {
//         const detail = await scraper.get_product_info(url);
//         jsonData.push(detail);
//     }

//     fs.writeFileSync('product_links.json', JSON.stringify(jsonData));
// }
// get_detail()

import express, { Request, Response, response } from 'express';
import { request } from 'http';
import { Scraper } from "./lib/scraper";
import * as fs from 'fs'

const app = express();
const scraper = new Scraper();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

app.get('/create-link', async (req: Request, res: Response) => {
    let counter: number = 0
    let product_links: any = []

    while (true) {
        counter += 1
        if (counter === 1) {
            break
        }

        product_links.push(
            await scraper.get_links(`https://www.trendyol.com/sr?wg=1&wc=101465&prc=1000-*&mb=kurumsal_satici%2Cbasarili_satici%2Cyetkili_satici&q=%C3%87apraz+%C3%87anta&pi=${counter - 1}`)
        )
    }

    const flat_link: any = Array.prototype.concat.apply([], product_links)
    fs.writeFileSync('product_links.txt', flat_link.join('\n'));

    res.download('product_links.txt', 'product_links.txt', (err) => {
        if (err) {
            res.status(500).send('Dosya indirilemedi.');
        } else {
            console.log('Dosya indirildi.');
        }
    });

    return;
});

app.get('/get-detail', (req: Request, res: Response) => {

})

const port = parseInt(process.env.PORT || '3000', 10);

app.listen(port, process.env.HOST || '0.0.0.0', () => {
    console.log(`Server is running on ${process.env.HOST || '0.0.0.0'}:${port}`);
});
