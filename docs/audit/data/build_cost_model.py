"""Audit assumptions only. Rebuild the two scenario CSVs; no external services."""
import csv
from pathlib import Path
root=Path(__file__).parent
with (root/'cost_scenarios.csv').open('w',newline='') as f:
 w=csv.writer(f);w.writerow(['reports_month','paid_conversion','paid_customers','price_kes','free_minutes_report','extra_minutes_paid','staff_hours','productive_fte_120_hours','net_revenue_kes','non_infra_cost_kes','infra_low_kes','infra_high_kes','contribution_low_kes','contribution_high_kes','retained_gb_20mb_6months'])
 for n,lo,hi in [(100,6500,19500),(1000,10400,32500),(10000,32500,130000),(100000,195000,780000)]:
  for p in [199,399,499,999]:
   revenue=n*.2*p*.92;cost=n*63
   w.writerow([n,.2,n*.2,p,1.5,10,round(n*3.5/60,2),round(n*3.5/7200,3),round(revenue,2),cost,lo,hi,round(revenue-cost-hi,2),round(revenue-cost-lo,2),n*.02*6])
with (root/'pricing_sensitivity.csv').open('w',newline='') as f:
 w=csv.writer(f);w.writerow(['price_kes','conversion','free_minutes_per_report','extra_minutes_paid_case','contribution_per_paid_before_fixed_kes','contribution_per_report_before_fixed_kes'])
 for p in [199,399,499,999]:
  for c in [.05,.2,.4]:
   for fm in [.25,1.5,4]:
    for pm in [5,10,20,45,75]:
     contribution=p*.92-10*pm-10-(10*fm+6+20)/c
     w.writerow([p,c,fm,pm,round(contribution,2),round(contribution*c,2)])
