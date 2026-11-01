# WSCSS AI learning hub

This is a static WSCSS AI learning hub with a 2027 HKDSE countdown, an AI homework study guide, and an AI exam revision guide. Exam data is stored separately in `exams.js`.

Teachers can click any subject card to open a larger countdown view.

## Pages

- `index.html`: Hub index
- `countdown.html`: DSE Countdown
- `ai-learning.html`: AI 功課指南 / AI Homework Guide
- `exam-revision.html`: AI 測考跟進 / AI Exam Review

## English / Chinese Toggle

Every page has an EN / 中文 toggle in the navigation bar. English is the default, and the visitor's choice is remembered in their browser by `i18n.js`.

Each language's content is written in the HTML with `data-lang="en"` or `data-lang="zh"`. When editing these pages, update both versions. Countdown card text comes from `exams.js` and `script.js`.

## Groups

Core Subjects:

- English Language
- English Language Listening and Integrated Skills
- Chinese Language
- Mathematics Compulsory Part
- Citizenship and Social Development

Elective Subjects:

- Visual Arts
- Chinese Literature
- Chemistry
- Geography
- Information and Communication Technology
- Biology
- Physics
- Economics
- Mathematics Extended Part
- Chinese History
- Business, Accounting and Financial Studies
- History

## Vercel Deployment

1. Upload this folder to GitHub, or import the folder directly in Vercel.
2. Set Framework Preset to `Other`.
3. Leave Build Command empty.
4. Leave Output Directory empty.
5. Deploy.

## Editing Exam Times

To edit subjects or exam times, open `exams.js` and change the relevant `dateTime`, along with the `dateLabel` and `dateLabelZh` text shown on the page:

```js
dateLabel: "Apr 12, 2027 (Mon), 8:30 AM",
dateLabelZh: "2027年4月12日（星期一）上午8:30",
dateTime: "2027-04-12T08:30:00+08:00",
```
