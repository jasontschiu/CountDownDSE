# WSCSS AI learning hub

This is a static WSCSS AI learning hub with a 2027 HKDSE countdown, an AI homework study guide, and an AI exam revision guide. Exam data is stored separately in `exams.js`.

Teachers can click any subject card to open a larger countdown view.

## Pages

- `index.html`: Hub index
- `countdown.html`: DSE Countdown
- `ai-learning.html`: 如何用 AI 學習功課 / AI Homework Study Guide
- `exam-revision.html`: AI 測考錯題跟進 / AI Exam Revision Guide

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

To edit subjects or exam times, open `exams.js` and change the relevant `dateTime`:

```js
dateTime: "2027-04-12T08:30:00+08:00"
```
