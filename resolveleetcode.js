const request = require('request-promise')
const selectList = [`//*[@id="question-detail-main-tabs"]/div[2]/div/div[1]/div`]


// translatedContent translatedTitle questionFrontendId
const queryString = (titleSlug) => `
    {"operationName":"questionData","variables":{"titleSlug":"${titleSlug}"},"query":"query questionData($titleSlug: String!) {   question(titleSlug: $titleSlug) {     questionId     questionFrontendId     boundTopicId     title     titleSlug     content     translatedTitle     translatedContent     isPaidOnly     difficulty     likes     dislikes     isLiked     similarQuestions     contributors {       username       profileUrl       avatarUrl       __typename     }     langToValidPlayground     topicTags {       name       slug       translatedName       __typename     }     companyTagStats     codeSnippets {       lang       langSlug       code       __typename     }     stats     hints     solution {       id       canSeeDetail       __typename     }     status     sampleTestCase     metaData     judgerAvailable     judgeType     mysqlSchemas     enableRunCode     enableTestMode     envInfo     __typename   } } "}
`

const pTagReg = /(<p>)|(<\/p>)/g
const codeTagReg = /(<code>)|(<\/code>)/g
const strongTagReg = /(<strong>)|(<\/strong>)/g
const preTagReg = /<\pre>|<\/pre>/g

const twon = /\n\n/g

class download {
    constructor(option) {
        this.name = option.name
        this.domain = option.domain
        this.selectList = option.selectList || selectList
    }
    async start() {
        const { name, domain } = this
        try{
            const problemPage = await request(`${name}`)
            return problemPage
        } catch(e) {
            return e
        }
    }
    parse(questionData) {
        // const document = PARSE5.parse(HTMLSTRING);
        // const xhtml = xmlser.serializeToString(document);
        // const doc = new dom().parseFromString(xhtml);
        // const select = xpath.useNamespaces({"x": "http://www.w3.org/1999/xhtml"});
        // const nodes = select("//x:a/@href", doc);
        // return this.selectList.map(v => select(v, doc))
        // console.log(questionData)
        let { translatedContent, translatedTitle, questionFrontendId } = questionData.data.question
        translatedContent = translatedContent.replace(pTagReg, '\r\n').replace(codeTagReg, ' ').replace(strongTagReg, ' ').replace(twon, '\n').replace(preTagReg, '```\r\n')
        return {
            translatedContent, translatedTitle, questionFrontendId
        }
    }
    async init(){
        try {
            const question = queryString(this.name)
            const body = JSON.stringify(JSON.parse(question))
            const questionData = await request({
                url: 'https://leetcode-cn.com/graphql',
                method: 'POST',
                body,
                headers: {
                    'content-type':'application/json',
                    'x-csrftoken':'TQ8EC7geyKoqBwH5crBF1BlMAbbrKDDpv6ACWwDcdgdAnUsawTct03ZamOdz65dH',
                    'referer':'https://leetcode-cn.com/problems/two-sum/',
                    'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36',
                    'origin':'https://leetcode-cn.com'
                }
                
            }).then(v => JSON.parse(v))
            return this.parse(questionData)
        }catch(e) {
            throw e
        }
    }
    toJSON(){
        return {
            name: 'download class'
        }
    }
}
// console.log(query);
// async function s() {
//     return await nodefetch('https://leetcode-cn.com/graphql', {
//         method: 'POST',
//         body: query,
//         'Content-Type': 'application/json',
//         'x-csrftoken': 'TQ8EC7geyKoqBwH5crBF1BlMAbbrKDDpv6ACWwDcdgdAnUsawTct03ZamOdz65dH',
//         referer: 'https://leetcode-cn.com/problems/two-sum/',
//         'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36',
//         origin: 'https://leetcode-cn.com'
//     }).then(res => console.log(res.text())).catch(e => console.log(e))
// }

// new download({
//     name: 'two-sum'
// }).init()

module.exports = download