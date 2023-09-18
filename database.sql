show tables;
SELECT DATABASE();

CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(40) UNIQUE,
  hashedPW VARCHAR(40),
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


CREATE TABLE weekly_totals (
    weekly_total_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    num_calories INT,
    total_desired_calories INT,
    avg_calories INT,
    percent INT,
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

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