# q-learning-vis
Interactive visualisation of an actor learning his environment through reinforcement learning.

This interactive visualisation allows the user to place a stylised robot into an unknown grid world that can be populated with obstacles and rewards.
The robot can then explore his environment and learn how to find his way to a reward-cell using Q-learning.

The value of the Q-function at every cell (=state) can be visualized through colour-coding, so that the user can see which cells seem promising to the robot.


Controlls:
- Click on a cell to construct a wall.
- Click on 'Place Target' and then on a cell to add a reward-field. When the robot steps on such a cell he gets a reward. The robot will eventually find out how to effectively navigate to reward-fields.
- 'Start/Stop Robot' lets the robot wander around the world, adding to his knowledge of the environment.
- With 'Train Robot' the exploration of the world can be sped up. The robot will walk to a target several times in order to learn.
- Click on 'Move Robot' to move the robot to a different location.
- 'Reset Robot' puts him back to his initial position without losing his knowledge.
- 'Visualize Q-function' toggles whether a color coding of the Q-function will be displayed on every cell visited by the robot. The greener the cell, the more confident the robot is in its usefulness, making him more likely to visit it again.
