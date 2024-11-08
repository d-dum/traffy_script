//@ts-check

const currentScript = document.currentScript;


/** @typedef {{id: number, type: string, title: string, username: string | undefined, photo_url: string | undefined}} WebAppChat */
/** @typedef {{id: number, is_bot: boolean, first_name: string, last_name: string | undefined, username: string | undefined, language_code: string, is_premium: boolean | undefined, added_to_attachment_menu: boolean | undefined, allows_write_to_pm: boolean | undefined, photo_url: string | undefined}} WebAppUser */
/** @typedef {{query_id: string | undefined, user: WebAppUser | undefined, receiver: WebAppUser | undefined, chat: WebAppChat | undefined, chat_type: string | undefined, chat_instance: string | undefined, start_param: string | undefined, can_send_after: number | undefined, auth_date: number, hash: string}} WebAppInitData */

/** Telegram window object
 *  @typedef {Object} Telegram
 *  @property {string} initData A string with raw data transferred to the Mini App, convenient for validating data.
 *  @property {WebAppInitData} initDataUnsafe An object with input data transferred to the Mini App.
 *  @property {string} version The version of the Bot API available in the user's Telegram app.
 *  @property {string} platform The name of the platform of the user's Telegram app.
 *  @property {"light" | "dark"} colorScheme The color scheme currently used in the Telegram app. Either “light” or “dark”.
 */


/** Metrics sent to server
 *  @typedef  {Object} ServerMetrics
 *  @property {number} user_id
 *  @property {string} language
 *  @property {boolean} is_premium
 *  @property {string} init_data 
 *  @property {string} url
 *  @property {string | undefined} start_param
 *  @property {string} campaign_id
 */

async function metricMain(){
    /** @type {any} */
    const w = window;
    if(typeof w.Telegram === "undefined" || typeof w.Telegram.WebApp === "undefined"){
        // TODO: executed outside of telegram env
        return;
    }

    /** @type {Telegram} */
    const telegram = w.Telegram.WebApp;

    const user = telegram.initDataUnsafe.user;
    if(typeof user === "undefined"){
        // TODO: user is not defined
        return;
    }

    if(currentScript === null){
        // TODO: outside of browser environment
        return;
    }

    const campaignId = currentScript.getAttribute("campaign_id");
    if(campaignId === null){
        // TODO: no campaign id
        return;
    }

    /** @type {ServerMetrics} */
    const data = {
        is_premium: typeof user.is_premium !== "undefined" ? user.is_premium : false,
        init_data: telegram.initData,
        language: user.language_code,
        user_id: user.id,
        url: window.location.href,
        start_param: telegram.initDataUnsafe.start_param,
        campaign_id: campaignId
    };

    try {
        await fetch("https://birdton.site/api/nmetrics", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: "no-cors",
            body: JSON.stringify(data)
        });
    } catch (error) {
        // TODO: try to send error
    }
}

document.addEventListener("DOMContentLoaded", metricMain);
  