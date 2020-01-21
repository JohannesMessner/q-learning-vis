var grid;
var gridHeight;
var gridWidth;
var cellHeight;
var cellWidth;
var robot;
var robotStarted;
var moveRobot;
var defaultRobotX;
var defaulRobotY;
var placeTarget;

var inTraining;
var trainingRunsPerformed;
var visQ;

var buttonStart;
var buttonResetRobot;
var buttonPlaceTarget;
var buttonMoveRobot;
var buttonTrain;
//var buttonVisQ;

var checkBoxVisQ;

var qFunction;
var discount;
var learningRate;
var defaultReward;
var targetReward;
var wallPenalty;
var qInitValue;

var up = 0;
var right = 1;
var down = 2;
var left = 3;

var gradientColors;
var colorIntervals;

function setup() {

  update = false;
  moveRobot = false;
  gridHeight = 10;
  gridWidth = 10;
  cellHeight = 50;
  cellWidth = 50;
  defaulRobotY = 5;
  defaultRobotX = 5;

  discount = 1/2;
  learningRate = 1/2;
  defaultReward = -1;
  targetReward = 50;
  wallPenalty = -2;
  qInitValue = 1;

  trainingRunsPerformed = 0;
  visQ = true;

  qFunction = new Array(gridWidth);
  for (let k = 0; k < gridWidth; k++) {
    qFunction[k] = new Array(gridHeight);
    for (let l = 0; l < gridHeight; l++) {
      qFunction[k][l] = new Array(4);
      for (let m = 0; m < 4; m++) {
        qFunction[k][l][m] = qInitValue;
      }
    }
  }

  gradientColors = [color(255,255,255,200), color(204,229,255,200), color(204,255,255,200),
                            color(204,255,229,200),color(204,255,204,200),
                            color(153,255,153,200), color(102,255,102,200),
                            color(51, 255, 51,200), color(0, 255, 0,200),
                            color(0, 204, 0,200), color(0,153,0,200), color(0,102,0,200)];

  let colorIntervalLength = (targetReward - wallPenalty)/(gradientColors.length)
  colorIntervals = [0];
  for (let n = 0; n < gradientColors.length-1; n++) {
    colorIntervals.push((n+1)*colorIntervalLength);
  }

  createCanvas(gridWidth * cellWidth + 200, gridHeight * cellHeight);

  grid = new Array(gridWidth);
  for (let i = 0; i < gridWidth; i++) {
    grid[i] = new Array(gridHeight);
    for (let j = 0; j < gridHeight; j++) {
      grid[i][j] = new Cell(i, j, cellWidth, cellHeight);
      }
    }

    robot = new Robot(defaultRobotX, defaulRobotY);
    circle(robot.xOnGrid*cellWidth + cellWidth/2, robot.yOnGrid*cellHeight + cellHeight/2, cellWidth);

    buttonStart = createButton('Start/Stop Robot');
    buttonStart.position(gridWidth * cellWidth + 100, 0);
    buttonStart.mousePressed(toggelRobotStarted);

    buttonStart = createButton('Reset Robot');
    buttonStart.position(gridWidth * cellWidth + 100, 30);
    buttonStart.mousePressed(resetRobot);

    buttonStart = createButton('Place Target');
    buttonStart.position(gridWidth * cellWidth + 100, 60);
    buttonStart.mousePressed(setPlaceTarget);

    buttonMoveRobot = createButton('Move Robot');
    buttonMoveRobot.position(gridWidth * cellWidth + 100, 90);
    buttonMoveRobot.mousePressed(setMoveRobot);

    buttonTrain = createButton('Train Robot');
    buttonTrain.position(gridWidth * cellWidth + 100, 120);
    buttonTrain.mousePressed(startTraining);

    /*buttonVisQ = createButton('Visualize Q-function');
    buttonVisQ.position(gridWidth * cellWidth + 100, 150);
    buttonVisQ.mousePressed(toggeQvis);*/

    checkBoxVisQ = createCheckbox('Visualize Q-function', true);
    checkBoxVisQ.position(gridWidth * cellWidth + 100, 150);
    checkBoxVisQ.changed(toggleQvis);
}

function draw() {

  for (let i = 0; i < gridWidth; i++) {
    for (let j = 0; j < gridHeight; j++) {
      let x = i*cellWidth;
      let y = j*cellHeight;
      rect(x, y, cellWidth, cellHeight)

      if (visQ) {
        drawQfunction(i, j);
      }
      let c = grid[i][j];
      if (c.isTarget) {
        drawTarget(c);
      }
      if (c.hasRobot) {
        drawRobot(i, j);
      }
      if (c.isWall) {
        drawWall(c);
      }
    }
  }

  if (inTraining) {
    trainRobot();
  } else if (frameCount % 15 == 0 && robotStarted) {
    robot.decideAndMakeMove();
  }
}

function trainRobot() {
  if (trainingRunsPerformed >= 50) {
    inTraining = false;
    trainingRunsPerformed = 0;
    resetRobot();
  }

  robot.decideAndMakeMove();
  let roboX = robot.xOnGrid;
  let roboY = robot.yOnGrid;
  let cellWithRobot = grid[roboX][roboY];

  if (cellWithRobot.isTarget) {
    resetRobot();
    trainingRunsPerformed++;
    moveRobot = false;
  }
}

function drawQfunction(x, y) {
  let xOnCanvas = x*cellWidth;
  let yOnCanvas = y*cellHeight;

  qValue = max(qFunction[x][y]);
  for (let i = colorIntervals.length-1; i >= 0; i--) {
    if (qValue >= colorIntervals[i]) {
      fill(gradientColors[i]);
      rect(xOnCanvas, yOnCanvas, cellWidth, cellHeight);
      fill(255);
      break;
    }
  }
}

function drawRobot(robotX, robotY) {
  fill(192,192,192);
  circle(robotX*cellWidth + cellWidth/2, robotY*cellHeight + cellHeight/2, cellWidth);
  fill(255);
}

function drawWall(cell) {
  fill(51);
  rect(cell.xOnCanvas, cell.yOnCanvas, cellWidth, cellHeight);
  fill(255);
}

function drawTarget(cell) {
  fill('red');
  rect(cell.xOnCanvas, cell.yOnCanvas, cellWidth, cellHeight);
  fill(255);
}

function toggleQvis() {
  if (this.checked()) {
    visQ = true;
  } else {
    visQ = false;
  }

}

function startTraining() {
  inTraining = true;
}

function setMoveRobot() {
  moveRobot = true;
}

function setPlaceTarget() {
  placeTarget = true;
}

function toggelRobotStarted() {
  robotStarted = !robotStarted;
}

function startRobot() {
  robotStarted = true;
}

function resetRobot() {
  robot.reset();
}

function moveRoboUp() {
  moveRobot(up);
}

function moveRoboDown() {
  moveRobot(down);
}

function moveRoboLeft() {
  moveRobot(left);
}

function moveRoboRight() {
  moveRobot(right);
}

function moveRobot(dir) {
  if (dir == up) {
    robot.moveUp();
  } else if (dir == down) {
    robot.moveDown();
  } else if (dir == right) {
    robot.moveRight();
  } else if (dir == left) {
    robot.moveLeft();
  }
}

function mouseClicked() {
  temp = robotStarted;
  robotStarted = false;
  if (robotStarted || mouseX > cellWidth*gridWidth || mouseY > cellHeight*gridHeight) {
    robotStarted = temp;
    return false;
  }
  let cell = getCell(mouseX, mouseY);
  if (placeTarget) {
    cell.changeIsTarget();
    placeTarget = false;
  } else if (moveRobot) {
    // move robot away from old cell
    grid[robot.xOnGrid][robot.yOnGrid].hasRobot = false;
    // move robot to new cell
    robot.xOnGrid = cell.xOnGrid;
    robot.yOnGrid = cell.yOnGrid;
    defaultRobotX = robot.xOnGrid;
    defaulRobotY = robot.yOnGrid;
    cell.hasRobot = true;
    moveRobot = false;
  } else {
    cell.changeIsWall();
  }
  robotStarted = temp;
}

function getXonCanvas(xOnGrid) {
  return xOnGrid*cellWidth;
}

function getYonCanvas(yOnGrid) {
  return yOnGrid*cellHeight;
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    moveRoboUp();
  } else if (keyCode === DOWN_ARROW) {
    moveRoboDown();
  }
  if (keyCode === LEFT_ARROW) {
    moveRoboLeft();
  } else if (keyCode === RIGHT_ARROW) {
    moveRoboRight();
  }

}

function getCell(x, y) {
  let xOnGrid = floor(x/cellWidth);
  let yOnGrid = floor(y/cellHeight);
  return grid[xOnGrid][yOnGrid];
}

function getCellIndex(xOnGrid, yOnGrid) {
  return yOnGrid*gridWidth + xOnGrid;
}

function getBestMove(x, y) {
  let bestMove = [0];
  let bestReward = defaultReward;
  for (let move = 0; move < 4; move++) {
    if (qFunction[x][y][move] > bestReward){
      bestReward = qFunction[x][y][move];
      bestMove = [move];
    } else if (qFunction[x][y][move] == bestReward) {
      bestMove.push(move);
    }
  }
  if (bestMove.length == 1) {
    return bestMove[0];
  } else {
    // choose random move among equally valued moves
    return bestMove[Math.floor(Math.random() * bestMove.length)];
  }
}

function updateQ(x, y, move, reward, newX, newY) {
  let oldQValue = qFunction[x][y][move];
  let maxValue = 0;
  for (let move = 0; move < 4; move++) {
    let value = qFunction[newX][newY][move];
    if (value > maxValue) {
      maxValue = value;
    }
  }
  qFunction[x][y][move] = (1-learningRate)*oldQValue + learningRate*(reward + discount*maxValue);
}

class Cell {
  constructor(xOnGrid, yOnGrid) {
    this.hasRobot = false;
    this.isWall = false;
    this.xOnGrid = xOnGrid;
    this.yOnGrid = yOnGrid;
    this.xOnCanvas = xOnGrid * cellWidth;
    this.yOnCanvas = yOnGrid * cellHeight;
    this.reward = defaultReward;
    this.isTarget = false;
    this.isIce = false;
  }

  changeIsWall() {
    this.isWall = !this.isWall;
  }

  changeIsIce() {
    this.isIce = !this.isIce;
  }

  changeIsTarget() {
    this.isTarget = !this.isTarget;
    if (this.isTarget) {
      this.reward = targetReward;
    } else {
      this.reward = defaultReward;
    }
  }
}

class Robot{
  constructor(xOnGrid, yOnGrid) {
    this.xOnGrid = xOnGrid;
    this.yOnGrid = yOnGrid;
    grid[this.xOnGrid][this.yOnGrid].hasRobot = true;
  }

  moveUp() {
    if (this.yOnGrid == 0 || grid[this.xOnGrid][this.yOnGrid-1].isWall) {
      return wallPenalty;
    }
    grid[this.xOnGrid][this.yOnGrid].hasRobot = false;
    this.yOnGrid -= 1;
    grid[this.xOnGrid][this.yOnGrid].hasRobot = true;
    return grid[this.xOnGrid][this.yOnGrid].reward;
  }

  moveDown() {
    if ( this.yOnGrid == gridHeight-1 || grid[this.xOnGrid][this.yOnGrid+1].isWall) {
      return wallPenalty;
    }
    grid[this.xOnGrid][this.yOnGrid].hasRobot = false;
    this.yOnGrid += 1;
    grid[this.xOnGrid][this.yOnGrid].hasRobot = true;
    return grid[this.xOnGrid][this.yOnGrid].reward;
  }

  moveRight() {
    if (this.xOnGrid == gridWidth-1 || grid[this.xOnGrid+1][this.yOnGrid].isWall) {
      return wallPenalty;
    }
    grid[this.xOnGrid][this.yOnGrid].hasRobot = false;
    this.xOnGrid += 1;
    grid[this.xOnGrid][this.yOnGrid].hasRobot = true;
    return grid[this.xOnGrid][this.yOnGrid].reward;
  }

  moveLeft() {
    if (this.xOnGrid == 0 || grid[this.xOnGrid-1][this.yOnGrid].isWall) {
      return wallPenalty;
    }
    grid[this.xOnGrid][this.yOnGrid].hasRobot = false;
    this.xOnGrid -= 1;
    grid[this.xOnGrid][this.yOnGrid].hasRobot = true;
    return grid[this.xOnGrid][this.yOnGrid].reward;
  }

  decideAndMakeMove() {
    let oldx = this.xOnGrid;
    let oldy = this.yOnGrid;
    let bestMove = getBestMove(this.xOnGrid, this.yOnGrid);
    let reward = this.move(bestMove);
    if (reward == targetReward) {
    }
    updateQ(oldx, oldy, bestMove, reward, this.xOnGrid, this.yOnGrid);
  }

  move(dir) {
    if (dir == up) {
      return this.moveUp();
    } else if (dir == down) {
      return this.moveDown();
    } else if (dir == right) {
      return this.moveRight();
    } else if (dir == left) {
      return this.moveLeft();
    }
  }

  reset() {
    grid[this.xOnGrid][this.yOnGrid].hasRobot = false;
    this.xOnGrid = defaultRobotX;
    this.yOnGrid = defaulRobotY;
    grid[this.xOnGrid][this.yOnGrid].hasRobot = true;
  }
}
