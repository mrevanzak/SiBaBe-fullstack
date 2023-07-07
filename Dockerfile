FROM rust:1.67 as build
ARG DATABASE_URL
ARG WEBHOOK_SECRET
ENV DATABASE_URL=$DATABASE_URL
ENV WEBHOOK_SECRET=$WEBHOOK_SECRET

RUN USER=root cargo new --bin sibabe
WORKDIR /sibabe

COPY ./.cargo ./.cargo
COPY ./Cargo.lock ./Cargo.lock
COPY ./Cargo.toml ./Cargo.toml
COPY ./prisma ./prisma
COPY ./api ./api
RUN cargo prisma generate
RUN cargo build --release

COPY ./api/src .
RUN cargo build --release

FROM debian:bullseye-slim
COPY --from=build /sibabe/target/release/sibabe .

RUN apt-get update \
    && apt-get install -y ca-certificates tzdata  \
    && rm -rf /var/lib/apt/lists/*

CMD ["./sibabe"]