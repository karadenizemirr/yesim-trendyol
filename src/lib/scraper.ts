import axios from "axios"
import * as cheero from "cheerio"

export class Scraper {
    private readonly proxy_url: string = "https://realtime.oxylabs.io/v1/queries"
    private payload: any
    private base_url: string = "https://www.trendyol.com"
    private href: any = []

    constructor() { }

    async get_links(target_url: string) {
        try {
            const payload = {
                source: 'universal',
                url: target_url
            }
            const response = await axios.post(this.proxy_url, payload, {
                auth: {
                    username: 'karadenizemirr01',
                    password: 'Sansar7534'
                }
            })
            const html = response.data['results'][0]['content']
            const $ = cheero.load(html)
            const product_card = $('.p-card-wrppr')
            const product_link = product_card.find('a')

            product_link.each((index, element: any) => {
                this.href.push(
                    this.base_url + product_link[index].attribs.href
                )
            })

            return this.href

        } catch (err) {
            return false
        }
    }

    async get_product_info(product_url: string) {
        try {
            const payload = {
                source: 'universal',
                url: product_url
            }
            const response = await axios.post(this.proxy_url, payload, {
                auth: {
                    username: 'karadenizemirr01',
                    password: 'Sansar7534'
                }
            })

            const html = response.data['results'][0]['content']
            const $ = cheero.load(html)

            const product_name = $('#product-detail-app > div > div.flex-container > div > div > div:nth-child(2) > div > div.product-detail-wrapper > div.pr-in-w > div > div > div:nth-child(1) > h1 > span').text() || null
            const product_price = $('#product-detail-app > div > div.flex-container > div > div > div:nth-child(2) > div > div.product-detail-wrapper > div.pr-in-w > div > div > div.product-price-container > div > div > span').text() || null
            const product_size = $('#product-detail-app > div > div.flex-container > div > div > div:nth-child(2) > div > div.product-detail-wrapper > div.size-variant-wrapper.size-variant-wrapper--without-expectation > div.variants > div > div.styles-module_sliderBase__swkx1.attributeSlider-carousel > div').text() || null
            const product_color_div = $('#product-detail-app > div > div.flex-container > div > div > div:nth-child(2) > div > div.product-detail-wrapper > div.slicing-attributes > section > div.attributeSlider > div.styles-module_sliderBase__swkx1.attributeSlider-carousel > div') || null
            const product_color:any = []
            const product_color_a = product_color_div.find('a')
            product_color_a.each((index:any, element:any) => {
                product_color.push(product_color_a[index].attribs.title)
            })
            const product_main_img = $('#product-detail-app > div > div.flex-container > div > div > div:nth-child(1) > div > div.product-image-container > div > div > img').attr('src') || null
            const product_all_img_div = $('#product-detail-app > div > div.flex-container > div > div > div:nth-child(1) > div > div.styles-module_sliderBase__swkx1.product-slide-container > div') || null
            const product_all_img_tag = product_all_img_div.find('img')
            const product_images:any = []
            product_all_img_tag.each((index:any, element:any) => {
                product_images.push(
                    product_all_img_tag[index].attribs.src
                )
            })
            const product_favori = $('#product-detail-app > div > div.flex-container > div > div > div:nth-child(2) > div > div.product-detail-wrapper > div.pr-in-w > div > div > div.pr-in-ratings > div > div.product-favorite-container > div > span').text() ||null
            const product_star = $('#product-detail-app > div > div.flex-container > div > div > div:nth-child(2) > div > div.product-detail-wrapper > div.pr-in-w > div > div > div.pr-in-ratings > div > div.review-tooltip > div > div > div > div.rating-line-count').text() ||null
            const product_comment = $('#product-detail-app > div > div.flex-container > div > div > div:nth-child(2) > div > div.product-detail-wrapper > div.pr-in-w > div > div > div.pr-in-ratings > div > a > span').text() ||null
            const popular_seller = $('#product-detail-app > div > div.flex-container > div > div > div:nth-child(2) > div > div.product-widget-list > section > div.widget-title.product-seller-line > div.pr-mb > div > div.seller-container > a').text() ||null
            const properties = $('#product-detail-app > div > section > div > ul') ||null
            const property_list:any = []

            properties.find('li').each((item, element) => {
                const key = $(element).find('span:nth-child(1)').text();
                const value = $(element).find('span:nth-child(2)').text();
                const property = {
                  [key]: value
                };
                property_list.push(property)
            })

            const detail_ul = $('#product-detail-app > div > section > div > div > div > ul')|| null
            const details:any = []
            const detail = detail_ul.find('li').slice(6).each((index:any,element:any) => {
                const _value = $(element).text()
                const pattern = /([A-Za-zÇçĞğİıÖöŞşÜü\s]+?)\s*:\s*([A-Za-zÇçĞğİıÖöŞşÜü\s]+)/g;
                let match:any;
                const parse_data:any = {}

                while (match = pattern.exec(_value)) {
                    const title = match[1].trim();
                    const value = match[2].trim();
                    parse_data[title] = value;
                }
                details.push(parse_data)
            })
            const result = {
                product_name: product_name,
                product_price: product_price,
                product_size: product_size,
                product_color: product_color,
                product_main_img: product_main_img,
                product_images: product_images,
                product_favori: product_favori,
                product_star: product_star,
                product_comment: product_comment,
                popular_seller: popular_seller,
                product_property: property_list,
                product_detail: details
            }
            return result
        } catch (err) {
            console.log(err)
            return false
        }
    }
}