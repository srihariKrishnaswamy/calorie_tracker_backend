CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(40) UNIQUE,
  hashedPW VARCHAR(100),
  first_name VARCHAR(40),
  last_name VARCHAR(40),
  birth_day DATE,
  sex VARCHAR(1),
  weight INT,
  height INT,
  target_calories INT,
  current_daily_total_id INT,
  current_weekly_total_id INT,
  pinned_user_1_id INT,
  pinned_user_2_id INT,
  pinned_user_3_id INT,
  pinned_user_4_id INT,
  pinned_user_5_id INT,
  FOREIGN KEY (pinned_user_1_id) REFERENCES users(user_id) ON DELETE SET NULL,
  FOREIGN KEY (pinned_user_2_id) REFERENCES users(user_id) ON DELETE SET NULL,
  FOREIGN KEY (pinned_user_3_id) REFERENCES users(user_id) ON DELETE SET NULL,
  FOREIGN KEY (pinned_user_4_id) REFERENCES users(user_id) ON DELETE SET NULL,
  FOREIGN KEY (pinned_user_5_id) REFERENCES users(user_id) ON DELETE SET NULL
);

INSERT INTO users (email, hashedPW, first_name, last_name) VALUES ("davidwallace@gmail.com", "password", "david", "wallace");

CREATE TABLE daily_totals (
    daily_total_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    weekly_total_id INT,
    num_calories INT,
    desired_calories INT,
    percent INT,
    curr_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (weekly_total_id) REFERENCES weekly_totals(weekly_total_id) ON DELETE CASCADE
);

ALTER TABLE users
ADD FOREIGN KEY(current_weekly_total_id)
REFERENCES weekly_totals(weekly_total_id)
ON DELETE SET NULL;

ALTER TABLE users
ADD FOREIGN KEY(current_daily_total_id)
REFERENCES daily_totals(daily_total_id)
ON DELETE SET NULL;

CREATE TABLE entry (
    entry_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    food_name VARCHAR(40),
    description VARCHAR(100),
    num_calories INT,
    daily_total_id INT,
    FOREIGN KEY (daily_total_id) REFERENCES daily_totals(daily_total_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

ALTER TABLE entry
ADD COLUMN created_at DATETIME;

ALTER TABLE daily_totals
DROP FOREIGN KEY daily_totals_ibfk_2;

ALTER TABLE daily_totals
DROP COLUMN weekly_total_id;

ALTER TABLE users
DROP FOREIGN KEY users_ibfk_6;

Show tables;

drop table weekly_totals;

INSERT INTO daily_totals (user_id, num_calories, desired_calories, percent, curr_date, timezone)
VALUES (2, 0, 2300, 0, '2023-09-09', 'US/Pacific');

alter table users add column timezone VARCHAR(50);

alter table daily_totals add column timezone VARCHAR(50);

alter table entry add column timezone VARCHAR(50);

insert into entry (user_id, food_name, description, num_calories, daily_total_id, created_at, timezone)
values(1, "alfredo", "cheese alfredo", 400, 1, NOW(), 'US/Pacific');

ALTER TABLE users
DROP COLUMN hashedPW;

ALTER TABLE users
ADD COLUMN hashedPW VARCHAR(200);

select * from users;

select * from daily_totals;

select * from entry;

select * from daily_totals where user_id = 14;