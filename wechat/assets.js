module.exports={
  "brands": [
    {
      "id": "deepseek",
      "name": "DeepSeek",
      "color": "#4d6bfe",
      "image": "images/deepseek.png"
    },
    {
      "id": "qwen",
      "name": "千问 Qwen",
      "color": "#7252e5",
      "image": "images/qwen.png"
    },
    {
      "id": "doubao",
      "name": "豆包",
      "color": "#4189ff",
      "image": "images/doubao.png"
    },
    {
      "id": "openai",
      "name": "OpenAI",
      "color": "#243e35",
      "image": "images/openai.png"
    },
    {
      "id": "claude",
      "name": "Claude",
      "color": "#d97757",
      "image": "images/claude.png"
    },
    {
      "id": "gemini",
      "name": "Gemini",
      "color": "#6a8bf4",
      "image": "images/gemini.png"
    },
    {
      "id": "kimi",
      "name": "Kimi",
      "color": "#25272b",
      "image": "images/kimi.png"
    },
    {
      "id": "zai",
      "name": "智谱 GLM",
      "color": "#233dff",
      "image": "images/zai.png"
    }
  ],
  "gpus": [
    {
      "name": "A100",
      "architecture": "Ampere",
      "memory": "80 GB HBM2e",
      "bandwidth": "2,039 GB/s",
      "peak": 312,
      "cost": 312,
      "color": "#b8f59d",
      "source": "https://www.nvidia.com/content/dam/en-zz/Solutions/Data-Center/a100/pdf/nvidia-a100-datasheet-us-nvidia-1758950-r4-web.pdf",
      "image": "images/a100.png"
    },
    {
      "name": "H100",
      "architecture": "Hopper",
      "memory": "80 GB HBM3",
      "bandwidth": "3.35 TB/s",
      "peak": 989,
      "cost": 780,
      "color": "#b5eaff",
      "source": "https://www.nvidia.com/en-us/data-center/h100/",
      "image": "images/h100.png"
    }
  ],
  "models": [
    {
      "name": "豆豆",
      "size": "0.1B",
      "cards": 1,
      "dataMB": 256,
      "seconds": 7,
      "tokens": 200
    },
    {
      "name": "灵灵",
      "size": "1B",
      "cards": 2,
      "dataMB": 1024,
      "seconds": 10,
      "tokens": 600
    },
    {
      "name": "喵喵",
      "size": "3B",
      "cards": 3,
      "dataMB": 4096,
      "seconds": 12,
      "tokens": 1500
    },
    {
      "name": "星云",
      "size": "7B",
      "cards": 4,
      "dataMB": 8192,
      "seconds": 15,
      "tokens": 3000
    },
    {
      "name": "极光",
      "size": "14B",
      "cards": 6,
      "dataMB": 32768,
      "seconds": 18,
      "tokens": 5000
    },
    {
      "name": "银河",
      "size": "32B",
      "cards": 9,
      "dataMB": 131072,
      "seconds": 22,
      "tokens": 8000
    },
    {
      "name": "宇宙",
      "size": "70B",
      "cards": 12,
      "dataMB": 524288,
      "seconds": 25,
      "tokens": 12000
    },
    {
      "name": "星海",
      "size": "128B MoE",
      "cards": 16,
      "dataMB": 1048576,
      "seconds": 30,
      "tokens": 20000
    }
  ]
};
