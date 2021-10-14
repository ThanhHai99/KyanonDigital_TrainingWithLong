# Table of content

- [Giới thiệu](#Giới-thiệu)
- [Điều kiện tiên quyết](#Điều-kiện-tiên-quyết)
- [Cách thực thi](#Cách-thực-thi)
  - [Thực thi với npm](#Thực-thi-với-npm)
  - [Thực thi với docker](#Thực-thi-với-docker)
- [Cách sử dụng](#Cách-sử-dụng)
  - [Hướng dẫn chung](#Hướng-dẫn-chung)
  - [Test API với Insomnia](#Hướng-dẫn-sử-dụng-ứng-dụng-với-Insomnia)
- [Tính năng](#Tính-năng)
  - [Auth](#Auth)
    - [Đăng nhập](#Đăng-nhập)
    - [Đăng ký](#Đăng-ký)
    - [Xác thực email](#Xác-thực-email)
  - [Loại sản phẩm](#Loại-sản-phẩm)
    - [Xem tất cả loại](#Xem-tất-cả-loại)
    - [Xem chi tiết loại](#Xem-chi-tiết-loại)
    - [Tạo mới loại](#Tạo-mới-loại)
    - [Cập nhật loại](#Cập-nhật-loại)
  - [Lịch sử loại](#Lịch-sử-loại)
    - [Xem tất cả lịch sử loại](#Xem-tất-cả-lịch-sử-loại)
    - [Xem chi tiết lịch sử loại](#Xem-chi-tiết-lịch-sử-loại)
  - [Hóa đơn](#Hóa-đơn)
    - [Xem tất cả hóa đơn](#Xem-tất-cả-hóa-đơn)
    - [Xem chi tiết hóa đơn](#Xem-hóa-chi-tiết-đơn)
  - [Sản phẩm](#Sản-phẩm)
    - [Xem tất cả sản phẩm](#Xem-tất-cả-sản-phẩm)
    - [Xem chi tiết sản phẩm](#Xem-chi-tiết-sản-phẩm)
    - [Xem mới sản phẩm](#Tạo-mới-sản-phẩm)
    - [Cập nhật sản phẩm](#Cập-nhật-sản-phẩm)
  - [Lịch sử sản phẩm](#Lịch-sử-sản-phẩm)
    - [Xem tất cả lịch sử sản phẩm](#Xem-tất-cả-lịch-sử-sản-phẩm)
    - [Xem chi tiết lịch sử sản phẩm](#Xem-chi-tiết-lịch-sử-sản-phẩm)
  - [Order](#Order)
    - [Xem tất cả order](#Xem-tất-cả-order)
    - [Xem chi tiết order](#Xem-chi-tiết-order)
    - [Tạo mới order](#Tạo-mới-order)
    - [Cập nhật order](#Cập-nhật-order)
  - [Lịch sử giá](#Lịch-sử-giá)
    - [Xem tất cả lịch sử giá](#Xem-tất-cả-lịch-sử-giá)
    - [Xem chi tiết lịch sử giá](#Xem-chi-tiết-lịch-sử-giá)
  - [Quyền](#Quyền)
    - [Xem tất cả quyền](#Xem-tất-cả-quyền)
    - [Xem chi tiết quyền](#Xem-chi-tiết-quyền)
  - [Khuyến mãi](#Khuyến-mãi)
    - [Xem tất cả khuyến mãi](#Xem-tất-cả-khuyến-mãi)
    - [Xem chi tiết khuyến mãi](#Xem-chi-tiết-khuyến-mãi)
    - [Tạo mới khuyến mãi](#Tạo-mới-khuyến-mãi)
    - [Cập nhật khuyến mãi](#Cập-nhật-khuyến-mãi)
  - [Lịch sử khuyến mãi](#Lịch-sử-khuyến-mãi)
    - [Xem tất cả lịch sử khuyến mãi](#Xem-tất-cả-lịch-sử-khuyến-mãi)
    - [Xem chi tiết lịch sử khuyến mãi](#Xem-chi-tiết-lịch-sử-khuyến-mãi)
  - [Người dùng](#Người-dùng)
    - [Xem tất cả người dùng](#Xem-tất-cả-người-dùng)
    - [Xem chi tiết người dùng](#Xem-chi-tiết-người-dùng)
    - [Tạo mới người dùng](#Tạo-mới-người-dùng)
    - [Cập nhật người dùng](#Cập-nhật-người-dùng)
  - [Kho](#Kho)
    - [Xem tất cả sản phẩm trong kho](#Xem-tất-cả-sản-phẩm-trong-kho)
    - [Xem chi tiết sản phẩm trong kho](#Xem-chi-tiết-sản-phẩm-trong-kho)
    - [Thống kê sản phẩm tồn kho](#Thống-kê-sản-phẩm-tồn-kho)
    - [Nhập kho](#Nhập-kho)
  - [Lịch sử kho](#Lịch-sử-kho)
    - [Xem tất cả lịch sử kho](#Xem-tất-cả-lịch-sử-kho)
    - [Xem chi tiết lịch sử kho](#Xem-chi-tiết-lịch-sử-kho)
- [Thông tin liên lạc](#Thông-tin-liên-lạc)

# Giới thiệu

Ứng dụng shopping online, được viết bằng ngôn ngữ JavaScript 😑😑

# Điều kiện tiên quyết

Đã cài đặt nodejs <https://nodejs.org/en/download/>

Đã cài đặt thư viện `ts-node (v10.1.0)`

```console
$ npm install ts-node@10.1.0 -g
```

# Cách thực thi

## Thực thi với npm

- **Step 1**: Open cmd at source code

- **Step 2**: Install essential library

```console
$ npm install nest -g
$ npm install
```

- **Step 3**: Rename file `./.env.example` to `./.env` and set environment variables

- **Step 4**: Run project

```console
$ npm start
```

- **Step 5(Optional)**: Seeding data

```console
$ npm run db:sync
```


# Cách sử dụng

## Hướng dẫn chung

Xem hướng dẫn tại http://your-hosts/#/

## Hướng dẫn sử dụng ứng dụng với Insomnia

Cài đặt Insomnia <https://insomnia.rest/download>

# Thiết kế database

<p align="left"> <img src="./doc/image/" width="800" /> </p>

# Tính năng

## Xác thực

### Đăng nhập

`Route (POST) /auth/login`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

### Đăng ký

`Route (POST) /auth/register`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

### Xác thực email

`Route (POST) /auth/verify/:token`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

## Loại sản phẩm

### Xem tất cả loại

`Route (GET) /category`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

### Xem chi tiết loại

`Route (GET) /category/:id`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

### Tạo mới loại

`Route (POST) /category`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

### Cập nhật loại

`Route (PATCH) /category/:id`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

## Lịch sử loại

### Xem tất cả lịch sử loại

`Route (GET) /category_log`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

### Xem chi tiết lịch sử loại

`Route (GET) /category_log/:id`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

## Hóa đơn

### Xem tất cả hóa đơn

`Route (GET) /invoice`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

### Xem chi tiết hóa đơn

`Route (GET) /invoice/:id`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

## Sản phẩm

### Xem tất cả sản phẩm

`Route (GET) /item`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

### Xem chi tiết sản phẩm

`Route (GET) /item/:id`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

### Tạo mới sản phẩm

`Route (POST) /item`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

### Cập nhật sản phẩm

`Route (PATCH) /item/:id`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

## Lịch sử sản phẩm

### Xem tất cả lịch sử sản phẩm

`Route (GET) /item_log`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

### Xem chi tiết lịch sử sản phẩm

`Route (GET) /item_log/:id`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

## Order

### Xem tất cả order

`Route (GET) /order`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

### Xem chi tiết order

`Route (GET) /order/:id`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

### Tạo mới order

`Route (POST) /order`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

### Cập nhật order

`Route (PATCH) /order/:id`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

## Lịch sử giá

### Xem tất cả lịch sử giá

`Route (GET) /price_log`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

### Xem chi tiết lịch sử giá

`Route (GET) /price_log/:id`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

## Quyền

### Xem tất cả quyền

`Route (GET) /role`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

### Xem chi tiết quyền

`Route (GET) /role/:id`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

## Khuyến mãi

### Xem tất cả khuyến mãi

`Route (GET) /sale`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

### Xem chi tiết khuyến mãi

`Route (GET) /sale/:id`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

### Tạo mới khuyến mãi

`Route (POST) /sale`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

### Cập nhật khuyến mãi

`Route (PATCH) /sale/:id`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

## Lịch sử khuyến mãi

### Xem tất cả lịch sử khuyến mãi

`Route (GET) /sale_log`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

### Xem chi tiết lịch sử khuyến mãi

`Route (GET) /sale_log/:id`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

## Người dùng

### Xem tất cả người dùng

`Route (GET) /user`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

### Xem chi tiết người dùng

`Route (GET) /user/:id`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

### Tạo mới người dùng

`Route (POST) /user`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

### Cập nhật người dùng

`Route (PATCH) /user/:id`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

## Kho

### Xem tất cả sản phẩm trong kho

`Route (GET) /warehouse`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

### Xem chi tiết sản phẩm trong kho

`Route (GET) /warehouse/:id`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

### Thống kê sản phẩm tồn kho

`Route (GET) /warehouse/inventory`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

### Nhập kho

`Route (POST) /warehouse/importing`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

## Lịch sử kho

### Xem tất cả lịch sử kho

`Route (GET) /warehouse_log`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

### Xem chi tiết lịch sử kho

`Route (GET) /warehouse_log/:id`

<p align="left"> <img src="./doc/image/" width="800" /> </p>

# Thông tin liên lạc

Rất mong nhận được nhận được ý kiến, nhận xét của bạn đọc.
Nếu có bất kì thắc mắc gì, vui lòng liên hệ địa chỉ email sau:

- **Hải Trần** &lt;tranvietthanhhaiit@gmail.com&gt;
