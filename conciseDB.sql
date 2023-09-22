CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(40) UNIQUE,
  hashedPW VARCHAR(200),
  first_name VARCHAR(40),
  last_name VARCHAR(40),
  birth_day DATE,
  sex VARCHAR(1),
  weight INT,
  height INT,
  target_calories INT,
  current_daily_total_id INT,
  pinned_user_1_id INT,
  pinned_user_2_id INT,
  pinned_user_3_id INT,
  pinned_user_4_id INT,
  pinned_user_5_id INT,
  timezone VARCHAR(50),
  FOREIGN KEY (pinned_user_1_id) REFERENCES users(user_id) ON DELETE SET NULL,
  FOREIGN KEY (pinned_user_2_id) REFERENCES users(user_id) ON DELETE SET NULL,
  FOREIGN KEY (pinned_user_3_id) REFERENCES users(user_id) ON DELETE SET NULL,
  FOREIGN KEY (pinned_user_4_id) REFERENCES users(user_id) ON DELETE SET NULL,
  FOREIGN KEY (pinned_user_5_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE daily_totals (
    daily_total_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    num_calories INT,
    desired_calories INT,
    percent INT,
    curr_date DATE,
    timezone VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

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
    created_at DATETIME,
    timezone VARCHAR(50),
    FOREIGN KEY (daily_total_id) REFERENCES daily_totals(daily_total_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);