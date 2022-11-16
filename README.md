# ラズパイでセンサーの値を取得する

## インストール

I2C デバイスを使用する場合は i2c-tools をインストールする。

```bash
sudo apt install i2c-tools
```

```bash
yarn install
```

## 設定

カレントディレクトリの .env に定義する。

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

## 実行

```bash
node index.js
```


## その他

I2C デバイスの確認

```bash
i2cdetect -y 1
```

## 参考
[data sheet](https://d2air1d4eqhwg2.cloudfront.net/media/files/262fda6e-3a57-4326-b93d-a9d627defdc4.pdf)
[Sensirion/raspberry-pi-i2c-scd4x](https://github.com/Sensirion/raspberry-pi-i2c-scd4x#connecting-the-sensor)