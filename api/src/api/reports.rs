use prisma_client_rust::{ chrono::{ self, Datelike, DateTime, FixedOffset, Utc, Timelike }, and };
use rspc::{ RouterBuilder, Error, ErrorCode, Type };
use serde::{ Serialize, Deserialize };

use crate::prisma;

use super::{ AdminCtx, AdminRouter };

pub(crate) fn admin_route() -> RouterBuilder<AdminCtx> {
  AdminRouter::new()
    .query("get", |t| {
      t(|ctx: AdminCtx, _: ()| async move {
        let current_year = chrono::Utc::now().year();

        let get_report_query = ctx.db
          .reports()
          .find_many(
            vec![
              prisma::reports::date::gte(
                chrono::DateTime::<chrono::FixedOffset>
                  ::parse_from_rfc3339(&format!("{}-01-01T00:00:00+00:00", current_year))
                  .unwrap()
              ),
              and!(
                prisma::reports::date::lte(
                  chrono::DateTime::<chrono::FixedOffset>
                    ::parse_from_rfc3339(&format!("{}-12-31T23:59:59+00:00", current_year))
                    .unwrap()
                )
              )
            ]
          )
          .exec().await
          .map_err(|err| {
            Error::with_cause(
              ErrorCode::InternalServerError,
              "Gagal mengambil laporan".to_string(),
              err
            )
          })?;

        Ok(get_report_query)
      })
    })
    .mutation("create", |t| {
      #[derive(Serialize, Deserialize, Type)]
      struct CreateReportArgs {
        date: String,
        total_cost: i32,
      }
      t(|ctx: AdminCtx, input: CreateReportArgs| async move {
        let date = DateTime::<FixedOffset>::parse_from_rfc2822(&input.date).unwrap();
        let _create_productions_query = ctx.db
          .productions()
          .create(date, input.total_cost, prisma::admins::id::equals(ctx.user_id), vec![])
          .exec().await
          .map_err(|err| {
            Error::with_cause(
              ErrorCode::InternalServerError,
              "Gagal membuat laporan".to_string(),
              err
            )
          })?;

        let now = DateTime::<FixedOffset>
          ::from(Utc::now())
          .with_hour(0)
          .unwrap()
          .with_minute(0)
          .unwrap()
          .with_second(0)
          .unwrap()
          .with_nanosecond(0)
          .unwrap();

        let create_report_query = ctx.db
          .reports()
          .upsert(
            prisma::reports::date::equals(now),
            prisma::reports::create(
              vec![
                prisma::reports::date::set(now),
                prisma::reports::expense::set(input.total_cost.clone())
              ]
            ),
            vec![prisma::reports::expense::increment(input.total_cost)]
          )
          .exec().await?;

        Ok(create_report_query)
      })
    })
}
