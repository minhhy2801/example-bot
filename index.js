const SlackBot = require('slackbots')
const axios = require('axios')
const kintone = require('@kintone/kintone-js-sdk')
const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const bot = new SlackBot({
    token: 'xoxb-689666442037-689708200149-3IpWx0M3BFPl4vuFX7Zjar7K',
    name: 'cybozubot'
})


// The next two lines will be modified later
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(5000); // port

app.post('/actions', (req, res) => {
    const payload = JSON.parse(req.body.payload);
    const { type, user, submission } = payload;
    console.log(1111);

    // Verifying the request. I'll explain this later in this tutorial!
    if (!signature.isVerified(req)) {
        res.sendStatus(404);
        return;
    }

    if (type === 'message_action') {
        // open a dialog!
    } else if (type === 'dialog_submission') {
        // dialog is submitted
    }
});



// Start Handler
bot.on('start', () => {
    const params = {
        icon_emoji: ':heart:'
    }

    bot.postMessageToChannel('general', 'Get ready!', params)
})

//Error Hander
bot.on('error', (err) => {
    console.log(err);
})

//Message Handler
bot.on('message', (data) => {
    if (data.type !== 'message') {
        return
    }
    console.log(data);

    handleMessage(data.text)
})

const handleMessage = (msg) => {

    if (msg.includes('get records')) {
        getMessage()
    }
}

const getMessage = async () => {
    let item = await renderTask();
    const params = {
        icon_emoji: ':100:', "blocks": item
    }
    bot.postMessageToChannel('general', "aa", params)
}

const renderTask = async () => {
    try {
        const records = await getRecordsKintone()

        let header = {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `We found ${records.totalCount} records`
            }
        }
        let divider = { "type": "divider" }

        let btn = {
            "type": "actions",
            "block_id": "actionblock789",
            "elements": [
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Link Button"
                    },
                    "url": "https://api.slack.com/block-kit"
                }
            ]
        }

        let item = []
        item.push(header)
        item.push(divider)

        for (let i = 0; i < 3; i++) {
            let textDiv = `*Project Name: ${records.records[i].txt_projectTitle.value}*
        Task Name: ${records.records[i].txt_taskTitle.value}
        Progress: ${records.records[i].num_progress.value} %
        Status: ${records.records[i].rb_status.value}`
            let taskDiv =
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": textDiv
                }
            }
            item.push(taskDiv)
            item.push(divider)
        }
        item.push(btn)
        return item

    } catch (error) {
        console.log(error);
    }
}

const getRecordsKintone = () => {
    const auth = new kintone.Auth()
    auth.setPasswordAuth('cybozu', 'cybozu')
    const connection = new kintone.Connection('test1-1.cybozu-dev.com', auth)
    const kintoneRecords = new kintone.Record(connection)
    const fields = ['txt_taskTitle', 'rb_status', 'Record_number', 'txt_projectTitle', 'rich_text_description', 'num_progress']
    return kintoneRecords.getRecords(2, '', fields, true).then(resp => {
        return resp
    })
}




