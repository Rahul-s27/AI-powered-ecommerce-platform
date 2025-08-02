from apscheduler.schedulers.background import BackgroundScheduler
from feeds.fetcher import fetch_and_store_all
import time

scheduler = BackgroundScheduler()
scheduler.add_job(fetch_and_store_all, 'interval', hours=6)
scheduler.start()

if __name__ == "__main__":
    print("[CRON] Scheduler started. Running fetch job every 6 hours.")
    try:
        while True:
            time.sleep(60)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
