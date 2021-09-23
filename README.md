# ラズパイでセンサーの値を取得する

実行

```bash
node index.js
```

設定をカレントディレクトリの .env に定義する。

.env 例）

```text
# 取得間隔 [ms]
INTERVAL=6000

# BME280（I2C） から取得する。
BME280=on

# SHT31（I2C） から取得する。
SHT31=on

# DS18B20（1-Wire） から取得する。
DS18B20=on

# Nature Remo から取得する。
NatureRemo=on
NatureRemoToken=xxxxxxxxxxxxxxxxxxxxxxxxxxx
```
