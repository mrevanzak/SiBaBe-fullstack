use prisma_client_rust::{ chrono::{ self, Datelike }, and };
use rspc::{ RouterBuilder, Error, ErrorCode };

use crate::prisma;

use super::{ AdminCtx, AdminRouter };

pub(crate) fn admin_route() -> RouterBuilder<AdminCtx> {
  AdminRouter::new().query("get", |t| {
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
}
