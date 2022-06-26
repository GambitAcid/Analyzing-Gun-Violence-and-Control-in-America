Drop VIEW IF EXISTS vw_gva_ds;

CREATE VIEW vw_gva_ds

as

Select  COALESCE(app_date, inc_date) cal_date,
		COALESCE(a."State", b."State") "State",
		CASE WHEN app_count IS NULL THEN 0 Else app_count end app_count,
		CASE WHEN inc_count IS NULL THEN 0 Else inc_count end inc_count
From	(
		Select	app_date, 
				"State",
				SUM(*) app_count
		From 	(

				Select	TO_DATE("Month" || '-01','YYYY-MM-DD') app_date,
						"State", 
						"NICsChecksID" 
				From	"NICsChecks"
				) aa
		group by app_date, 
				"State"
		) a	
		FULL OUTER JOIN
		(
		Select	inc_date, 
				"State",
				COUNT(*) inc_count
		From 	(

				Select	TO_DATE("Date", 'YYYY-MM-DD') inc_date,
						"State", 
						"IncidentID"
				From	"Incident"
				) aa
		group by inc_date, 
				"State"
		) b on a.app_date = b.inc_date and a."State" = b."State";
		
Select * From vw_gva_ds