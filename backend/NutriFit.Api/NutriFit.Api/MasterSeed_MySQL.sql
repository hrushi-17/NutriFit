-- ==============================================
-- NutriFit Master Database Seed Script (MySQL Version)
-- ==============================================

-- 🔴 RESET AND CLEAR TABLES (SAFE ORDER)
DELETE FROM MealLogs;
DELETE FROM DietPlanFoods;
DELETE FROM DietPlans;
DELETE FROM Foods;
DELETE FROM UserWorkouts;
DELETE FROM WorkoutPlanDetails;
DELETE FROM WorkoutPlans;
DELETE FROM Workouts;
DELETE FROM HealthConditions;

DELETE FROM Users;
DELETE FROM Admins;

ALTER TABLE MealLogs AUTO_INCREMENT = 1;
ALTER TABLE DietPlanFoods AUTO_INCREMENT = 1;
ALTER TABLE DietPlans AUTO_INCREMENT = 1;
ALTER TABLE Foods AUTO_INCREMENT = 1;
ALTER TABLE WorkoutPlanDetails AUTO_INCREMENT = 1;
ALTER TABLE WorkoutPlans AUTO_INCREMENT = 1;
ALTER TABLE Workouts AUTO_INCREMENT = 1;
ALTER TABLE HealthConditions AUTO_INCREMENT = 1;
ALTER TABLE Users AUTO_INCREMENT = 1;
ALTER TABLE Admins AUTO_INCREMENT = 1;

-- 🔴 HEALTH CONDITIONS
INSERT INTO HealthConditions (Name, Description) VALUES
('None','No condition'),
('Diabetes','Sugar related'),
('BP','Blood pressure'),
('Thyroid','Hormonal issue'),
('PCOS','Hormonal disorder'),
('Asthma','Breathing issue');


-- 🔴 WORKOUTS (MASTER CATALOG – STATIC)
INSERT INTO Workouts (WorkoutName,WorkoutType,Intensity,CaloriesBurnedPerMin,HealthSafe) VALUES
-- Cardio
('Walking','Cardio','Low',4,'Safe for all'),
('Treadmill Walk','Cardio','Low',5,'Safe for all'),
('Cycling','Cardio','Moderate',7,'Safe for diabetes, PCOS'),
('Stationary Bike','Cardio','Moderate',7,'Safe for BP'),
('Jogging','Cardio','High',9,'Avoid for asthma, BP'),
('Jump Rope','Cardio','High',12,'Not safe for BP, asthma'),
('Elliptical','Cardio','Moderate',8,'Low joint impact'),
-- Strength (Gym)
('Push Ups','Strength','Moderate',8,'Safe for all'),
('Bench Press','Strength','High',10,'Avoid for BP'),
('Lat Pulldown','Strength','Moderate',9,'Safe for all'),
('Bicep Curls','Strength','Low',6,'Safe for all'),
('Squats','Strength','Moderate',9,'Safe for all'),
('Leg Press','Strength','High',11,'Avoid for BP'),
('Lunges','Strength','Moderate',9,'Safe for all'),
-- Core
('Plank','Core','Low',6,'Safe for all'),
('Crunches','Core','Moderate',7,'Safe for all'),
-- Recovery
('Yoga','Flexibility','Low',3,'Safe for all'),
('Stretching','Flexibility','Low',2,'Safe for all'),
('Breathing Exercise','Flexibility','Low',1,'Best for asthma, BP'),
('Meditation','Flexibility','Low',1,'Stress & hormone balance');

-- 🔴 WORKOUT PLANS (AUTO-GENERATED RULES)
INSERT INTO WorkoutPlans (Goal, WeightCategory, ActivityLevel, HealthConditionId, MaxIntensity)
SELECT 
    g.Goal,
    w.WeightCategory,
    a.ActivityLevel,
    h.HealthConditionId,
    CASE 
        WHEN h.Name IN ('BP','Asthma','Thyroid','PCOS') THEN 'Low'
        WHEN a.ActivityLevel = 'High' AND h.Name = 'None' THEN 'High'
        ELSE 'Moderate'
    END
FROM (SELECT 'Weight Loss' AS Goal UNION ALL SELECT 'Muscle Gain' UNION ALL SELECT 'Fitness') g
CROSS JOIN (SELECT 'Underweight' AS WeightCategory UNION ALL SELECT 'Normal' UNION ALL SELECT 'Overweight') w
CROSS JOIN (SELECT 'Low' AS ActivityLevel UNION ALL SELECT 'Medium' UNION ALL SELECT 'High') a
CROSS JOIN HealthConditions h
WHERE NOT (g.Goal='Muscle Gain' AND w.WeightCategory='Overweight')
  AND NOT (g.Goal='Weight Loss' AND w.WeightCategory='Underweight');


-- 🔴 WORKOUT PLAN DETAILS (STATIC WEEKLY TEMPLATES)
-- 🟢 LOW
INSERT INTO WorkoutPlanDetails (PlanId,WorkoutId,DayName,DurationMinutes)
SELECT p.PlanId, v.WorkoutId, v.DayName, v.DurationMinutes
FROM WorkoutPlans p
JOIN (
SELECT 1 AS WorkoutId, 'Monday' AS DayName, 25 AS DurationMinutes UNION ALL
SELECT 2, 'Tuesday', 25 UNION ALL
SELECT 18, 'Wednesday', 20 UNION ALL
SELECT 19, 'Thursday', 15 UNION ALL
SELECT 20, 'Friday', 15 UNION ALL
SELECT 1, 'Saturday', 30
) v ON 1=1
WHERE p.MaxIntensity='Low';

-- 🟡 MODERATE
INSERT INTO WorkoutPlanDetails (PlanId,WorkoutId,DayName,DurationMinutes)
SELECT p.PlanId, v.WorkoutId, v.DayName, v.DurationMinutes
FROM WorkoutPlans p
JOIN (
SELECT 3 AS WorkoutId, 'Monday' AS DayName, 30 AS DurationMinutes UNION ALL
SELECT 8, 'Tuesday', 30 UNION ALL
SELECT 10, 'Wednesday', 30 UNION ALL
SELECT 12, 'Thursday', 30 UNION ALL
SELECT 16, 'Friday', 20 UNION ALL
SELECT 7, 'Saturday', 30
) v ON 1=1
WHERE p.MaxIntensity='Moderate';

-- 🔴 HIGH
INSERT INTO WorkoutPlanDetails (PlanId,WorkoutId,DayName,DurationMinutes)
SELECT p.PlanId, v.WorkoutId, v.DayName, v.DurationMinutes
FROM WorkoutPlans p
JOIN (
SELECT 9 AS WorkoutId, 'Monday' AS DayName, 35 AS DurationMinutes UNION ALL
SELECT 5, 'Tuesday', 25 UNION ALL
SELECT 13, 'Wednesday', 35 UNION ALL
SELECT 11, 'Thursday', 30 UNION ALL
SELECT 17, 'Friday', 25 UNION ALL
SELECT 6, 'Saturday', 30
) v ON 1=1
WHERE p.MaxIntensity='High';


-- 🟢 STEP 2: INSERT FOODS (EXACT USER PROFILE MATCH)
INSERT INTO Foods 
(FoodName, FoodType, Calories, Protein, Carbs, Fat, GlycemicIndex, SodiumContent)
VALUES
-- ================= VEGAN =================
('Oats','Vegan',150,5,27,3,'Low',2),
('Apple','Vegan',52,0.3,14,0.2,'Low',1),
('Banana','Vegan',89,1.1,23,0.3,'Medium',1),
('Brown Rice','Vegan',216,5,45,1.8,'Medium',5),
('Vegetable Salad','Vegan',80,3,12,1,'Low',10),
('Sprouts','Vegan',120,10,18,2,'Low',15),
('Chickpeas','Vegan',164,9,27,2.6,'Low',7),
('Peanut Butter','Vegan',188,8,6,16,'Low',4),

-- ================= VEGETARIAN =================
('Milk','Vegetarian',120,8,12,5,'Medium',100),
('Curd','Vegetarian',98,6,8,4,'Low',70),
('Paneer','Vegetarian',265,18,6,20,'Low',120),
('Dal','Vegetarian',180,9,22,4,'Low',140),
('Chapati','Vegetarian',120,3,20,3,'Medium',150),
('Vegetable Khichdi','Vegetarian',190,7,30,4,'Medium',130),
('Cheese Sandwich','Vegetarian',210,10,22,9,'Medium',180),
('Vegetable Soup','Vegetarian',90,4,10,2,'Low',60),

-- ================= NON-VEGETARIAN =================
('Boiled Eggs','Non-Vegetarian',155,13,1,11,'Low',120),
('Egg Omelette','Non-Vegetarian',170,14,2,13,'Low',140),
('Grilled Chicken','Non-Vegetarian',220,35,0,5,'Low',90),
('Chicken Curry','Non-Vegetarian',260,30,6,12,'Low',130),
('Fish Curry','Non-Vegetarian',240,28,5,10,'Low',110),
('Chicken Soup','Non-Vegetarian',150,20,5,3,'Low',80),
('Tuna Salad','Non-Vegetarian',180,30,4,6,'Low',70),
('Boiled Fish','Non-Vegetarian',200,26,0,9,'Low',95);


-- 🟢 STEP 3: INSERT ALL POSSIBLE DIET PLANS
-- (Goal × Condition × FoodPreference × WeightCategory)
INSERT INTO DietPlans (Goal, ConditionId, FoodPreference, WeightCategory)
SELECT g.Goal, h.HealthConditionId, f.FoodPreference, w.WeightCategory
FROM (
  SELECT 'Weight Loss' AS Goal UNION ALL 
  SELECT 'Muscle Gain' UNION ALL 
  SELECT 'Fitness'
) g
CROSS JOIN HealthConditions h
CROSS JOIN (
  SELECT 'Vegan' AS FoodPreference UNION ALL 
  SELECT 'Vegetarian' UNION ALL 
  SELECT 'Non-Vegetarian'
) f
CROSS JOIN (
  SELECT 'Underweight' AS WeightCategory UNION ALL 
  SELECT 'Normal' UNION ALL 
  SELECT 'Overweight'
) w;

-- 🟢 STEP 4: CONNECT EVERY PLAN WITH 5 DAILY MEALS
INSERT INTO DietPlanFoods (DietId, FoodId, MealType)
SELECT 
    DietId,
    FoodId,
    CASE rn
        WHEN 1 THEN 'breakfast'
        WHEN 2 THEN 'snack'
        WHEN 3 THEN 'lunch'
        WHEN 4 THEN 'snack2'
        WHEN 5 THEN 'dinner'
    END
FROM (
    SELECT 
        dp.DietId,
        f.FoodId,
        ROW_NUMBER() OVER (PARTITION BY dp.DietId ORDER BY f.FoodId) AS rn
    FROM DietPlans dp
    JOIN Foods f ON f.FoodType = dp.FoodPreference
) AS FoodPool
WHERE rn <= 5;
