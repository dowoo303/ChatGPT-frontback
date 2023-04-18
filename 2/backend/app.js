require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

const port = process.env.PORT;

// 미들웨어
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// Chat GPT와 통신하기 위해 비동기 함수로 코딩
app.post("/chat", async (req, res) => {
  try {
    const { content } = req.body;

    const bearerToken = req.headers.authorization?.substring(7); // ?: optional chaining

    // if (req.headers.authorization === undefined) {
    //   return res.send("에러");
    // }
    // optional chaining로 대체

    // 스크릿 키 검사
    if (bearerToken !== process.env.SECRET_KEY) {
      return res
        .status(400)
        .json({ ok: false, error: "올바른 키를 입력해주세요." });
    }
    if (!content) {
      return res.status(400).json({ ok: false, error: "질문을 입력해주세요." });
    }

    // Chat GTP와 소통
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_KEY}`,
        },
      }
    );

    res.json({ ok: true, result: response.data.choices[0].message.content });
  } catch (error) {
    console.error(error);

    res.json({ ok: false, error });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port} 🎈`);
});
