# Table of content

-   [Giới thiệu](#Giới-thiệu)
-   [Điều kiện tiên quyết](#Điều-kiện-tiên-quyết)
-   [Cách thực thi](#Cách-thực-thi)
    -   [Thực thi với npm](#Thực-thi-với-npm)
    -   [Thực thi với docker](#Thực-thi-với-docker)
-   [Thông tin liên lạc](#Thông-tin-liên-lạc)

# Giới thiệu

Ứng dụng shopping online, được viết bằng JavaScript 😑😑

# Điều kiện tiên quyết

Đã cài đặt nodejs <https://nodejs.org/en/download/>

Đã cài đặt thư viện `ts-node (v10.1.0)`

```console
$ npm install ts-node@10.1.0 -g
```

# Cách thực thi

## Thực thi với npm

-   **Bước 1**: Mở cmd tại source code

-   **Bước 2**: Cài đặt những thư viện cần thiết cho dự án

```console
$ npm install nest -g
$ npm install
```

-   **Bước 3**: Đổi tên file `./.env.example` thành `./.env`

-   **Bước 4**: Thiết lập biến môi trường tại file `./.env`

-   **Bước 5**: Khởi chạy dự án

```console
$ npm start
```

## Thực thi với docker

-   **Bước 0**: Cài đặt docker <https://www.docker.com/products/docker-desktop>

-   **Bước 1**: Mở cmd tại source code

-   **Bước 2**: Cài đặt những thư viện cần thiết cho dự án

```console
$ npm install nest -g
$ npm install
```

-   **Bước 3**: Đổi tên file `./.env.example` thành `./.env`

-   **Bước 4**: Thiết lập biến môi trường tại file `./.env`

-   **Bước 5**: Khởi chạy dự án

```console
$ docker-compose up
```

# Thông tin liên lạc

Rất mong nhận được nhận được ý kiến, nhận xét của bạn đọc.
Nếu có bất kì thắc mắc gì, vui lòng liên hệ địa chỉ email sau:

-   **Hải Trần** &lt;tranvietthanhhaiit@gmail.com&gt;
