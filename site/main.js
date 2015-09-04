// Generated by CoffeeScript 1.6.3
var B_NONE, B_PLACEBLE, B_PLACED, B_UNPLACEBLE, Blocks, Castle, Castles, END, E_CASTLE, E_FIELD, E_ROAD, FIELD, Field, Fields, FieldsGraph, Playground, Road, Roads, User, Users,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __slice = [].slice;

B_NONE = 0;

B_PLACEBLE = 1;

B_PLACED = 2;

B_UNPLACEBLE = 3;

END = 4;

FIELD = 5;

E_FIELD = 1;

E_CASTLE = 2;

E_ROAD = 3;

Blocks = (function() {
  Blocks.prototype._playground = {};

  Blocks.prototype._blocks = [];

  Blocks.prototype.__blocks = [];

  Blocks.prototype._edgeBlocks = [];

  Blocks.prototype.currentBlock = {};

  Blocks.prototype.currentUser = {};

  Blocks.prototype.grid = [];

  Blocks.prototype.castleCompleted = true;

  Blocks.prototype.roadCompleted = true;

  Blocks.prototype.roadTakenBy = [0, 0, 0, 0, 0, 0];

  Blocks.prototype.castleTakenBy = [0, 0, 0, 0, 0, 0];

  Blocks.prototype.plate = null;

  Blocks.prototype.pool = [];

  Blocks.prototype.probeBlocks = [];

  function Blocks(data, callback, Users) {
    this.donePlaceFollower = __bind(this.donePlaceFollower, this);
    var animate, b, block, _i, _len;
    this.loadResource();
    this.callback = callback;
    this.Users = Users;
    this.initGrid();
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      b = data[_i];
      block = this.makeBlock(b);
    }
    this.Utest();
    this.setUI();
    animate = function() {
      renderer.render(stage);
      return requestAnimFrame(animate);
    };
    requestAnimFrame(animate);
  }

  Blocks.prototype.logger = function() {
    $('.row')[0].innerText = 'follower placed: ' + this.currentBlock.followerPlaced.toLocaleString();
    $('.row')[1].innerText = 'edges: ' + this.currentBlock.edges.toLocaleString();
    console.log(this.currentBlock);
    return console.log(this.__blocks);
  };

  Blocks.prototype.randomize = function(blocks) {
    var i, n, removed, _i, _results;
    _results = [];
    for (i = _i = 1; _i <= 100; i = ++_i) {
      n = Math.floor(Math.random() * 56);
      removed = blocks.splice(n, 1);
      _results.push(blocks.push(removed[0]));
    }
    return _results;
  };

  Blocks.prototype.Utest = function() {
    var winners;
    winners = this.calScorers([1, 2, 2, 1, 1, 1]);
    return console.assert(winners.indexOf(2) > -1 && winners.indexOf(3) > -1, 'Util.calScorers');
  };

  Blocks.prototype.loadResource = function() {
    var followers, i, texture, _i, _results;
    followers = [];
    _results = [];
    for (i = _i = 1; _i <= 6; i = ++_i) {
      texture = PIXI.Texture.fromImage('images/player-' + i + '.png');
      _results.push(PIXI.Texture.addTextureToCache(texture, i));
    }
    return _results;
  };

  Blocks.prototype.setUI = function() {
    var _this = this;
    this.plate = new PIXI.DisplayObjectContainer();
    this.plate.setInteractive(true);
    stage.addChild(this.plate);
    $('#right').click(function() {
      return _this.plate.position.x += 1;
    });
    document.querySelectorAll('#block')[0].addEventListener("click", function(event) {
      _this.donePlace();
      _this.drawPlacable();
      _this.drawFollower();
      $('#block').hide();
      return $('#follower').show();
    });
    document.querySelectorAll('#follower')[0].addEventListener("click", function(event) {
      _this.donePlaceFollower(_this.callback);
      return $('#follower').hide();
    });
    this.bindKey();
    this.place(4, 4, this._blocks[27]);
    this.donePlace();
    this.drawPlacable();
    return this.drawFollower();
  };

  Blocks.prototype.initGrid = function(num) {
    var gy, i, j, p, _i, _j, _results;
    _results = [];
    for (i = _i = 0; _i <= 19; i = ++_i) {
      gy = [];
      for (j = _j = 0; _j <= 19; j = ++_j) {
        p = i === 4 && j === 4 ? 1 : 0;
        gy.push([100 + 100 * i, 100 + 100 * j, p, null, null]);
      }
      _results.push(this.grid.push(gy));
    }
    return _results;
  };

  Blocks.prototype.bindKey = function() {
    console.log('===f clicked===');
    return document.onKeydown = function(e) {
      if (e.keyCode === 70) {
        console.log('===f clicked===');
        return $('#follower').click();
      } else if (e.keyCode === 82) {
        return $('#rotate').click();
      } else if (e.keyCode === 71) {
        return $('#block').click();
      }
    };
  };

  Blocks.prototype.makeBlock = function(data) {
    var i, img, texture, _i, _ref, _results;
    img = data[0];
    texture = PIXI.Texture.fromImage('images/block-' + img + '.png');
    _results = [];
    for (i = _i = 1, _ref = data[1]; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
      _results.push(this.makeOneBlock(texture, data));
    }
    return _results;
  };

  Blocks.prototype.makeOneBlock = function(texture, data) {
    var block, self;
    self = this;
    block = new PIXI.Sprite(texture);
    block.setInteractive(true);
    block.buttonMode = true;
    block.edges = data[3].slice();
    block.edgeTypes = data[4].slice();
    block.followerPlaced = [0, 0, 0, 0];
    block.cloister = false;
    block.fields = data[5].map(function(f) {
      var res;
      res = {};
      res.pos = f.slice(0, 2);
      res.edges = f[2];
      res.marked = false;
      res.takenBy = 0;
      return res;
    });
    block.seats = data[6].map(function(f) {
      var res;
      if (f[2].length === 0) {
        block.cloister = true;
      }
      res = [];
      res.push(f[0]);
      res.push(f[1]);
      res.push(f[2].slice());
      return res;
    });
    block.follower = null;
    block.rotation = 0;
    block.rotationN = 0;
    block.scale.x = block.scale.x / 1.11;
    block.scale.y = block.scale.y / 1.11;
    block.mousedown = block.touchstart = function(data) {
      this.data = data;
      this.alpha = 0.8;
      this.dragging = true;
      this.position.ox = this.position.x;
      return this.position.oy = this.position.y;
    };
    block.mouseup = block.mouseupoutside = block.touchend = block.touchendoutside = function(data) {
      var gx, gy;
      this.alpha = 1;
      this.dragging = false;
      this.data = null;
      gx = Math.max(0, Math.round(this.position.x / 100) - 1);
      gy = Math.max(0, Math.round(this.position.y / 100) - 1);
      if (self.isPlacable(gx, gy)) {
        self.place(gx, gy, this);
        return $('#block').show();
      } else {
        this.position.x = this.position.ox;
        return this.position.y = this.position.oy;
      }
    };
    block.mousemove = block.touchmove = function(data) {
      var newPosition;
      if (this.dragging) {
        newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x;
        return this.position.y = newPosition.y;
      }
    };
    block.anchor.x = 0.5;
    block.anchor.y = 0.5;
    block.position.x = 100;
    block.position.y = 100;
    block.value = data[2] === 0 ? 1 : 2;
    stage.addChild(block);
    return this._blocks.push(block);
  };

  Blocks.prototype.isPlacable = function(gx, gy) {
    return this.grid[gx][gy][2] === B_PLACEBLE;
  };

  Blocks.prototype.place = function(gx, gy, block) {
    var x, y;
    this.plate.addChild(block);
    x = (gx + 1) * 100;
    y = (gy + 1) * 100;
    block.position.x = x;
    block.position.y = y;
    block.gx = gx;
    block.gy = gy;
    this.currentBlock = block;
    this.__blocks.push(this.currentBlock);
    this.nextBlock = this._blocks[this._blocks.length - 1];
    this._blocks.pop();
    return this.setRotation(this.grid[gx][gy][4]);
  };

  Blocks.prototype.donePlace = function() {
    var block, gx, gy;
    block = this.currentBlock;
    gx = block.gx;
    gy = block.gy;
    this.rotateEdgeInfo(block);
    this.rotateEdge8(block);
    block.mousedown = block.touchstart = block.mouseup = block.mousemove = block.mouseupoutside = block.touchend = block.touchendoutside = null;
    block.click = block.touchstart = null;
    this.grid[gx][gy][2] = B_PLACED;
    this.grid[gx][gy][3] = block;
    this.updateEdges(gx, gy);
    $('#rotate').unbind('click');
    return this.plate.addChild(block);
  };

  Blocks.prototype.rotateEdgeInfo = function(block) {
    var n, s, _i, _len, _ref;
    n = block.rotationN;
    block.edges = this.rotate(block.edges, n);
    block.edgeTypes = this.rotate(block.edgeTypes, n);
    _ref = block.seats;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      s = _ref[_i];
      s[2] = this.rotate(s[2], n);
    }
    return console.log('rotate the edges and connectInfo with: ' + n);
  };

  Blocks.prototype.rotateEdge8 = function(block) {
    var f, n, _i, _len, _ref;
    n = block.rotationN;
    _ref = block.fields;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      f = _ref[_i];
      f.edges = f.edges.map(function(e) {
        return (e + n * 2) % 8;
      });
    }
  };

  Blocks.prototype.drawPlacable = function() {
    var angels, e, edges, gx, gy, placable, texture, _i, _len, _ref, _results;
    _ref = this._edgeBlocks;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      e = _ref[_i];
      gx = e[0];
      gy = e[1];
      edges = this.getEdges(gx, gy);
      angels = this.getMatchAngels(edges);
      if (this.grid[gx][gy][3] != null) {
        if (angels.length === 0 && this.grid[gx][gy][2] === 1) {
          this.plate.removeChild(this.grid[gx][gy][3]);
          this.grid[gx][gy][3] = null;
          this.grid[gx][gy][2] = 0;
        } else {
          this.grid[gx][gy][4] = angels;
        }
      }
      if (this.grid[gx][gy][2] === 0 && angels.length > 0) {
        texture = PIXI.Texture.fromImage('images/placable.png');
        placable = new PIXI.Sprite(texture);
        placable.scale.x = placable.scale.x / 1.11;
        placable.scale.y = placable.scale.y / 1.11;
        placable.anchor.x = 0.5;
        placable.anchor.y = 0.5;
        placable.position.x = this.grid[gx][gy][0];
        placable.position.y = this.grid[gx][gy][1];
        this.grid[gx][gy][2] = 1;
        this.grid[gx][gy][3] = placable;
        this.grid[gx][gy][4] = angels;
        _results.push(this.plate.addChild(placable));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Blocks.prototype.drawFollower = function() {
    var blank, s, seats, self, texture, _i, _len, _results;
    self = this;
    seats = this.getAvailableSeats();
    console.log(seats);
    _results = [];
    for (_i = 0, _len = seats.length; _i < _len; _i++) {
      s = seats[_i];
      texture = PIXI.Texture.fromImage('images/follower.png');
      blank = new PIXI.Sprite(texture);
      blank.setInteractive(true);
      blank.scale.x = blank.scale.x / 1.11;
      blank.scale.y = blank.scale.y / 1.11;
      blank.alpha = 0.5;
      blank.anchor.x = 0.5;
      blank.anchor.y = 0.5;
      blank.buttonMode = true;
      blank.position.x = -50 + s[0];
      blank.position.y = -50 + s[1];
      blank.pos = s[2];
      if (s[3] != null) {
        blank.fieldIndex = s[3];
      }
      blank.click = blank.touchstart = function() {
        console.log('click event');
        console.log(blank.position.x + ';' + blank.position.y);
        return self.placeFollower(this);
      };
      this.pool.push(blank);
      _results.push(this.currentBlock.addChild(blank));
    }
    return _results;
  };

  Blocks.prototype.placeFollower = function(blank) {
    var follower;
    if (this.currentFollower != null) {
      this.currentBlock.removeChild(this.currentFollower);
    }
    follower = new PIXI.Sprite.fromFrame(this.currentUser.id);
    follower.setInteractive(true);
    follower.scale.x = follower.scale.x / 6;
    follower.scale.y = follower.scale.y / 6;
    follower.anchor.x = 0.5;
    follower.anchor.y = 0.5;
    follower.position.x = blank.position.x;
    follower.position.y = blank.position.y;
    follower.user = this.currentUser;
    this.currentFollower = follower;
    if (blank.fieldIndex != null) {
      this.currentBlock.fields[blank.fieldIndex].takenBy = this.currentUser.id;
      this.currentBlock.followerPlaced = [0, 0, 0, 0];
    } else {
      this.currentBlock.followerPlaced = this.getFollowerState(blank.pos);
    }
    this.currentBlock.follower = follower;
    return this.currentBlock.addChild(follower);
  };

  Blocks.prototype.donePlaceFollower = function(callback) {
    this.clearPool();
    this.renderScore();
    this.currentFollower = null;
    return callback();
  };

  Blocks.prototype.updateEdges = function(gx, gy) {
    var e, i, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = this._edgeBlocks;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      e = _ref[i];
      if (e[0] === gx && e[1] === gy) {
        this._edgeBlocks.splice(i, 1);
        break;
      }
    }
    _ref1 = this.getNeighbors(gx, gy);
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      e = _ref1[_j];
      if (this.grid[e[0]][e[1]][2] === 0) {
        _results.push(this._edgeBlocks.push(e));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Blocks.prototype.setRotation = function(angels) {
    var block, i;
    console.debug('=== in setRotation === ');
    console.debug(angels);
    if (angels == null) {
      return;
    }
    block = this.currentBlock;
    block.rotation = angels[0] * Math.PI / 2;
    block.rotationN = angels[0];
    i = 1;
    return $('#rotate').click(function() {
      var a;
      a = angels[i % angels.length];
      block.rotation = a * Math.PI / 2;
      block.rotationN = a;
      return i++;
    });
  };

  Blocks.prototype.getAvailableSeats = function() {
    var e, f, i, n, s, seats, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    seats = [];
    n = this.currentBlock.rotationN != null ? this.currentBlock.rotationN : 0;
    _ref = this.currentBlock.seats;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      s = _ref[_i];
      _ref1 = s[2];
      for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
        e = _ref1[i];
        if (e === 1 && this.currentBlock.edges[i] === E_ROAD) {
          this.probeRoad(this.currentBlock, s, i, false);
          if (!this.roadTaken && seats.indexOf(s) === -1) {
            seats.push(s);
          }
        }
        if (e === 1 && this.currentBlock.edges[i] === E_CASTLE) {
          this.castleDFS(this.currentBlock, s, false);
          if (!this.castleTaken && seats.indexOf(s) === -1) {
            seats.push(s);
          }
          continue;
        }
      }
    }
    _ref2 = this.currentBlock.fields;
    for (i = _k = 0, _len2 = _ref2.length; _k < _len2; i = ++_k) {
      f = _ref2[i];
      this.probeField(this.currentBlock, f);
      if (!this.fieldTaken) {
        seats.push([f.pos[0], f.pos[1], f.edges, i]);
      }
    }
    console.debug('=== castle dfs ===');
    return seats;
  };

  Blocks.prototype.renderScore = function() {
    var e, i, s, _i, _j, _len, _len1, _ref, _ref1;
    _ref = this.currentBlock.seats;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      s = _ref[_i];
      _ref1 = s[2];
      for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
        e = _ref1[i];
        if (e === 1 && this.currentBlock.edges[i] === E_ROAD) {
          this.probeRoad(this.currentBlock, s, i, true);
        }
        if (e === 1 && this.currentBlock.edges[i] === E_CASTLE) {
          this.castleDFS(this.currentBlock, s, true);
        }
      }
    }
  };

  Blocks.prototype.getFollowerState = function(followerState) {
    var self;
    self = this;
    return followerState.map(function(f) {
      if (f === 1) {
        return self.currentUser.id;
      } else {
        return 0;
      }
    });
  };

  Blocks.prototype.isComplete = function(block) {
    var b, _i, _len, _ref;
    _ref = this.getNeighbors8(block.gx, block.gy);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      b = _ref[_i];
      if (this.grid[b[0]][b[1]][3] == null) {
        return false;
      }
    }
    return true;
  };

  Blocks.prototype.clearPool = function() {
    var obj, _i, _len, _ref;
    _ref = this.pool;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      obj = _ref[_i];
      this.currentBlock.removeChild(obj);
    }
    return this.pool = [];
  };

  Blocks.prototype.hasBlockLeft = function() {
    return this._blocks.length > 0;
  };

  Blocks.prototype.getBlock = function(cord) {
    var block, status;
    status = this.grid[cord[0]][cord[1]][2];
    block = this.grid[cord[0]][cord[1]][3];
    if (status === B_PLACED) {
      return block;
    } else {
      return null;
    }
  };

  Blocks.prototype.getEdges = function(gx, gy) {
    var edges, neighbors;
    neighbors = this.getNeighbors(gx, gy);
    edges = [];
    edges.push(this.getBlock(neighbors[0]) != null ? this.getBlock(neighbors[0]).edges[2] : null);
    edges.push(this.getBlock(neighbors[1]) != null ? this.getBlock(neighbors[1]).edges[3] : null);
    edges.push(this.getBlock(neighbors[2]) != null ? this.getBlock(neighbors[2]).edges[0] : null);
    edges.push(this.getBlock(neighbors[3]) != null ? this.getBlock(neighbors[3]).edges[1] : null);
    return edges;
  };

  Blocks.prototype.getNeighbors = function(gx, gy) {
    var result;
    result = [];
    result.push([gx, gy - 1]);
    result.push([gx + 1, gy]);
    result.push([gx, gy + 1]);
    result.push([gx - 1, gy]);
    return result;
  };

  Blocks.prototype.getNeighbors8 = function(gx, gy) {
    var result;
    result = [];
    result.push([gx, gy - 1]);
    result.push([gx + 1, gy - 1]);
    result.push([gx + 1, gy]);
    result.push([gx + 1, gy + 1]);
    result.push([gx, gy + 1]);
    result.push([gx - 1, gy + 1]);
    result.push([gx - 1, gy]);
    result.push([gx - 1, gy - 1]);
    return result;
  };

  Blocks.prototype.getMatchAngels = function(edges) {
    var angels, i, index, j, _i, _j, _ref;
    console.log(this.nextBlock.edges);
    angels = [];
    for (i = _i = 0; _i <= 3; i = ++_i) {
      j = 0;
      for (j = _j = i, _ref = i + 3; i <= _ref ? _j <= _ref : _j >= _ref; j = i <= _ref ? ++_j : --_j) {
        index = j % 4;
        if (edges[index] !== this.nextBlock.edges[j - i] && edges[index] !== null) {
          break;
        }
      }
      if (j === i + 4) {
        angels.push(i);
      }
    }
    return angels;
  };

  Blocks.prototype.getContra = function(pos) {
    var dic;
    dic = [2, 3, 0, 1];
    return dic[pos];
  };

  Blocks.prototype.getContra8 = function(pos) {
    var dic;
    dic = [5, 4, 7, 6, 1, 0, 3, 2];
    return dic[pos];
  };

  Blocks.prototype.rotate = function(array, n) {
    var e, i, _i;
    if (n === 0) {
      return array;
    }
    for (i = _i = 1; 1 <= n ? _i <= n : _i >= n; i = 1 <= n ? ++_i : --_i) {
      e = array.pop();
      array.unshift(e);
    }
    return array;
  };

  Blocks.prototype.castleDFS = function(src, seat, ifRender) {
    var e, i, nextBlock, _i, _len, _ref;
    this.probeBlocks = [];
    this.castleTaken = false;
    this.castleCompleted = true;
    this._score = src.value;
    this.clearMarked();
    src.marked = true;
    _ref = seat[2];
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      e = _ref[i];
      if (e !== 1) {
        continue;
      }
      if (src.edgeTypes[i] === END) {
        nextBlock = this.getNeighborCastles(src.gx, src.gy)[i];
        if (nextBlock === null) {
          this.castleCompleted = false;
          this.castleTaken = false;
          break;
        }
        if (src.followerPlaced[i] !== 0) {
          this.probeBlocks.push(src);
        }
        if (nextBlock.edgeTypes[this.getContra(i)] === END) {
          if (nextBlock.followerPlaced[this.getContra(i)] !== 0) {
            this.probeBlocks.push(nextBlock);
            this.castleTaken = true;
          }
          this._score += nextBlock.value;
          continue;
        } else {
          this._score += nextBlock.value;
          this._castleDFS(nextBlock);
        }
      } else {
        this._castleDFS(src);
      }
    }
    if (ifRender && this.castleCompleted === true) {
      return this.renderFinished(this._score, 'castle');
    }
  };

  Blocks.prototype._castleDFS = function(block) {
    var b, i, neighborCastles, takenBy, _i, _len, _results;
    block.marked = true;
    neighborCastles = this.getNeighborCastles(block.gx, block.gy);
    _results = [];
    for (i = _i = 0, _len = neighborCastles.length; _i < _len; i = ++_i) {
      b = neighborCastles[i];
      if (b === null) {
        if (block.edges[i] === E_CASTLE) {
          this.castleCompleted = false;
        }
        continue;
      }
      if (!b.marked) {
        this._score += b.value;
      }
      takenBy = b.followerPlaced[this.getContra(i)];
      if (takenBy !== 0) {
        this.probeBlocks.push(b);
        this.castleTaken = true;
      }
      if (!b.marked) {
        _results.push(this._castleDFS(b));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Blocks.prototype.getNeighborCastles = function(gx, gy) {
    var edges, neighbors, res;
    neighbors = this.getNeighbors(gx, gy);
    edges = this.getEdges(gx, gy);
    res = [];
    res.push(edges[0] === E_CASTLE ? this.getBlock(neighbors[0]) : null);
    res.push(edges[1] === E_CASTLE ? this.getBlock(neighbors[1]) : null);
    res.push(edges[2] === E_CASTLE ? this.getBlock(neighbors[2]) : null);
    res.push(edges[3] === E_CASTLE ? this.getBlock(neighbors[3]) : null);
    return res;
  };

  Blocks.prototype.clearMarked = function() {
    var b, _i, _len, _ref, _results;
    _ref = this.__blocks;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      b = _ref[_i];
      _results.push(b.marked = false);
    }
    return _results;
  };

  Blocks.prototype.probeRoad = function(block, seat, pos, ifRender) {
    var i, otherEndPos, s, score, start, startEdgeType, _i, _len, _ref;
    this.probeBlocks = [];
    this.roadTaken = false;
    this.roadCompleted = true;
    this.endCount = 0;
    start = [block.gx, block.gy];
    startEdgeType = block.edgeTypes[pos];
    score = 1;
    if (startEdgeType < END) {
      _ref = seat[2];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        s = _ref[i];
        if (s === 1 && i !== pos) {
          otherEndPos = i;
        }
      }
      this._probeRoad(block, start, startEdgeType, score, otherEndPos, ifRender);
    }
    return this._probeRoad(block, start, startEdgeType, score, pos, ifRender);
  };

  Blocks.prototype._probeRoad = function(block, start, startEdgeType, score, pos, ifRender) {
    var gx, gy, neighbors, nextBlock, nextEdge, placedBy;
    neighbors = this.getNeighbors(block.gx, block.gy);
    gx = neighbors[pos][0];
    gy = neighbors[pos][1];
    nextBlock = this.grid[gx][gy][2] === B_PLACED ? this.grid[gx][gy][3] : null;
    if (nextBlock == null) {
      this.roadCompleted = false;
      this.probeBlocks = [];
      return false;
    }
    if (block.edgeTypes[pos] === END && block.followerPlaced[pos] !== 0) {
      this.probeBlocks.push(block);
    }
    if ((nextBlock.follower != null) && nextBlock.followerPlaced[this.getContra(pos)] !== 0) {
      this.probeBlocks.push(nextBlock);
    }
    score += 1;
    nextEdge = nextBlock.edgeTypes[this.getContra(pos)];
    placedBy = nextBlock.followerPlaced[this.getContra(pos)];
    if (placedBy !== 0) {
      this.roadTaken = true;
    }
    if (nextEdge < END) {
      nextEdge = (this.getContra(pos) + nextEdge) % 4;
      if (placedBy != null) {
        this.roadTakenBy[placedBy] += 1;
      }
      return this._probeRoad(nextBlock, start, startEdgeType, score, nextEdge, ifRender);
    } else if (nextEdge === END) {
      this.endCount += 1;
      if (startEdgeType === END || [gx, gy] === start || this.endCount === 2) {
        if (ifRender) {
          this.renderFinished(score, 'road');
        }
      }
      return false;
    } else {
      console.log('error in edgeType');
      return false;
    }
  };

  Blocks.prototype.renderFinished = function(score, type) {
    var b, id, scorers, taken, user, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
    taken = [0, 0, 0, 0, 0, 0];
    console.debug('=== render finished ===');
    console.debug(this.probeBlocks);
    _ref = this.probeBlocks;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      b = _ref[_i];
      _ref1 = b.followerPlaced;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        id = _ref1[_j];
        if (id !== 0) {
          taken[id - 1] += 1;
          break;
        }
      }
      if (b.follower != null) {
        b.removeChild(b.follower);
        b.followerPlaced = [0, 0, 0, 0];
      }
    }
    scorers = this.calScorers(taken);
    if (type === 'castle') {
      score = score * 2;
    }
    for (_k = 0, _len2 = scorers.length; _k < _len2; _k++) {
      user = scorers[_k];
      this.Users.scoring(type, user, score);
    }
    this.udpateScoreBoard();
    return this.probeBlocks = [];
  };

  Blocks.prototype.udpateScoreBoard = function() {
    document.querySelectorAll('#u1')[0].innerText = this.Users.getScore(1);
    document.querySelectorAll('#u2')[0].innerText = this.Users.getScore(2);
    document.querySelectorAll('#u3')[0].innerText = this.Users.getScore(3);
    document.querySelectorAll('#u4')[0].innerText = this.Users.getScore(4);
    document.querySelectorAll('#u5')[0].innerText = this.Users.getScore(5);
    return document.querySelectorAll('#u6')[0].innerText = this.Users.getScore(6);
  };

  Blocks.prototype.calScorers = function(users) {
    var hosts, max, num, _i;
    max = 1;
    hosts = [];
    for (num = _i = 0; _i <= 5; num = ++_i) {
      if (users[num] > max) {
        max = users[num];
        hosts.clear;
        hosts.push(num + 1);
      }
      if (users[num] === max) {
        hosts.push(num + 1);
      }
    }
    return hosts;
  };

  Blocks.prototype.probeField = function(block, field) {
    this.fieldTaken = false;
    this.probeBlocks = [];
    this._score = 0;
    this.clearFieldMarked();
    this._probeField(block, field);
    return this.renderField();
  };

  Blocks.prototype._probeField = function(block, field) {
    var edge, edgeFour, nextBlock, nextField, _i, _len, _ref, _ref1;
    field.marked = true;
    _ref = field.edges;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      edge = _ref[_i];
      edgeFour = Math.floor(edge / 2);
      nextBlock = this.getBlock(this.getNeighbors(block.gx, block.gy)[edgeFour]);
      if (nextBlock == null) {
        continue;
      }
      nextField = this.getNeighborFields(nextBlock, edge);
      if ((_ref1 = this.getContra8(edge), __indexOf.call(nextField.edges, _ref1) >= 0) && nextField.takenBy > 0) {
        this.fieldTaken = true;
        this.probeBlocks.push(block);
        return;
      }
      if (!nextField.marked) {
        this._probeField(nextBlock, nextField);
      }
    }
  };

  Blocks.prototype.getNeighborFields = function(nextBlock, edge) {
    var edgeFour, field, _i, _len, _ref, _ref1;
    edgeFour = Math.floor(edge / 2);
    _ref = nextBlock.fields;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      field = _ref[_i];
      if (_ref1 = this.getContra8(edge), __indexOf.call(field.edges, _ref1) >= 0) {
        return field;
      } else {
        continue;
      }
    }
    return console.log('error in finding next field');
  };

  Blocks.prototype.clearFieldMarked = function() {
    var b, f, _i, _len, _ref, _results;
    _ref = this.__blocks;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      b = _ref[_i];
      _results.push((function() {
        var _j, _len1, _ref1, _results1;
        _ref1 = b.fields;
        _results1 = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          f = _ref1[_j];
          _results1.push(f.marked = false);
        }
        return _results1;
      })());
    }
    return _results;
  };

  Blocks.prototype.renderField = function() {
    console.log(this.probeBlocks);
    return console.log(this.fieldTaken);
  };

  return Blocks;

})();

Castles = (function() {
  function Castles() {}

  Castles.prototype._fieldScore = 0;

  Castles.prototype._score = 0;

  Castles.prototype.completed = false;

  Castles.prototype.taken = {};

  Castles.prototype.castle = [];

  Castles.prototype.blocks = [];

  Castles.prototype.takens = [0, 0, 0, 0, 0, 0];

  Castles.prototype.merge = function() {
    var Castles;
    Castles = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  };

  Castles.prototype.isComplete = function() {};

  Castles.prototype.takenBy = function() {
    var hosts, max, num, _i;
    max = 0;
    hosts = [];
    for (num = _i = 1; _i <= 6; num = ++_i) {
      if (this.taken[num] > max) {
        max = this.taken[num];
        hosts.clear;
        hosts.push(num);
      }
      if (this.taken[num] === max) {
        hosts.push(num);
      }
    }
    return hosts;
  };

  return Castles;

})();

Castle = (function() {
  function Castle() {}

  Castle.prototype.value = 0;

  Castle.prototype.taken = 0;

  return Castle;

})();

Fields = (function() {
  function Fields() {}

  Fields.prototype.graph = {};

  Fields.prototype.fields = [];

  Fields.prototype.marked = [];

  Fields.prototype.taken = [];

  Fields.prototype.wrapCastles = function(src) {
    return this.dfs(this.graph, src);
  };

  Fields.prototype.dfs = function(graph, src) {
    var v, _i, _len, _ref, _results;
    this.marked[src] = true;
    if (this.fields[src].Castle.completed) {
      user.fieldScore += this.fields[src].wrapCastleScore();
    }
    _ref = graph.adj[src];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      v = _ref[_i];
      if (!this.marked[v]) {
        _results.push(this.dfs(graph, v));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  return Fields;

})();

Field = (function() {
  function Field() {}

  Field.prototype._castle1 = {};

  Field.prototype._castle2 = {};

  Field.prototype.Castle1 = {};

  Field.prototype.Castle2 = {};

  Field.prototype.taken = 0;

  Field.prototype.wrapCastleScore = function() {
    return Castle1.fieldScore + Castle2.fieldScore;
  };

  return Field;

})();

FieldsGraph = (function() {
  function FieldsGraph(size) {
    while (size--) {
      this.adj[size] = [];
    }
  }

  FieldsGraph.prototype.adj = {};

  FieldsGraph.prototype.add = function(a, b) {
    this.adj[a].push(b);
    return this.adj[b].push(a);
  };

  return FieldsGraph;

})();

Playground = (function() {
  function Playground(data, n) {
    this.next = __bind(this.next, this);
    this.Users = new Users(n);
    this.initBlock(data);
  }

  Playground.prototype.Blocks = {};

  Playground.prototype.Users = {};

  Playground.prototype.initBlock = function(data) {
    var user;
    this.Blocks = new Blocks(data, this.next, this.Users);
    user = this.Users.nextUser();
    this.Blocks.currentUser = user;
    this.setUserUI(user);
    return this.Blocks._playground = this;
  };

  Playground.prototype.next = function() {
    var user;
    if (this.Blocks.hasBlockLeft()) {
      user = this.Users.nextUser();
      this.Blocks.currentUser = user;
      return this.setUserUI(user);
    }
  };

  Playground.prototype.setUserUI = function(user) {
    var s;
    s = user.id + ' is playing';
    return $('#user').html(s);
  };

  Playground.prototype.placeBlock = function(block) {};

  Playground.prototype.placeFollower = function(block) {};

  Playground.prototype.render = function(block) {
    this.renderRoad(block);
    this.renderCastle(block);
    this.renderField(block);
    return this.renderCloister(block);
  };

  Playground.prototype.renderRoad = function(block) {
    var completed, e, score, start, takens, user, _i, _len, _ref, _results;
    _ref = block._roadEdges;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      e = _ref[_i];
      completed = false;
      start = e;
      score = 1;
      takens = this.takenInit();
      while (e.pair.next != null) {
        score += 1;
        if (block.isCrossRoad && e.pair.next === 'cross') {
          completed = true;
          break;
        }
        takens[e.pair.takenBy] += 1;
        e = e.pair.next;
      }
      if (completed) {
        this.completeRoad(score, this.takenBy(takens), 'road');
        continue;
      }
      _results.push((function() {
        var _j, _len1, _ref1, _results1;
        _ref1 = this.takenBy(takens);
        _results1 = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          user = _ref1[_j];
          _results1.push(user.roadScore += score);
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };

  Playground.prototype.renderCastle = function(block) {
    if (block._castles != null) {
      return Castles.castleDFS(CastleGraph, block);
    }
  };

  Playground.prototype.renderField = function(block) {
    return Fields.wrapCastles(block);
  };

  Playground.prototype.renderCloister = function(block) {
    var neighbors, user;
    neighbors = Block.getNeighbors(block);
    user = block.takenBy;
    return user.scored['Cloister'] += neighbors.length;
  };

  Playground.prototype.takenInit = function() {
    var i, taken, _results;
    i = this.Users.num;
    taken = {};
    _results = [];
    while (i--) {
      taken[i] = 0;
      _results.push(taken);
    }
    return _results;
  };

  Playground.prototype.takenBy = function(takens) {
    var max, num, user, _i, _len;
    for (num = _i = 0, _len = takens.length; _i < _len; num = ++_i) {
      user = takens[num];
      if (num > max) {
        max = num;
      }
    }
    return _.filter([
      (function() {
        var _results;
        _results = [];
        for (user in takens) {
          num = takens[user];
          _results.push(num);
        }
        return _results;
      })()
    ], function(x) {
      return x === max;
    });
  };

  Playground.prototype.complete = function(score, takens, type) {
    var user, _i, _len;
    for (_i = 0, _len = takens.length; _i < _len; _i++) {
      user = takens[_i];
      user.scored[type] += score;
    }
    return UI.removeFollowers(takens);
  };

  return Playground;

})();

Roads = (function() {
  function Roads() {}

  Roads.prototype._roads = [];

  Roads.prototype._score = 0;

  Roads.prototype.takens = [0, 0, 0, 0, 0, 0];

  Roads.prototype.takenBy = 0;

  Roads.prototype.isComplete = function() {
    if (_.filter(this._roads, function(r) {
      return r.isVertex;
    }).length === 2) {
      return true;
    } else {
      return false;
    }
  };

  Roads.prototype.probe = function(block, pos) {
    var start;
    start = [block.gx, block.gy];
    return _probe(block, pos);
  };

  Roads.prototype._probe = function(block, pos) {
    var gx, gy, neighbors, nextBlock, nextPos, placedBy;
    neighbors = this.getNeighbors(block.gx, block.gy);
    gx = neighbors[pos][0];
    gy = neighbors[pos][1];
    if ([gx, gy] === start) {
      this.renderFinishedRoad();
      return;
    }
    console.info('next block' + gx + '; ' + gy);
    nextBlock = this.grid[gx][gy][3];
    if (nextBlock == null) {
      return;
    }
    this._score += 1;
    nextPos = nextBlock.edgesConnect[this.getContra(pos)];
    placedBy = nextBlock.followerPlaced[this.getContra(pos)];
    if (nextPos === 4) {
      this.renderFinishedRoad();
      return;
    }
    if (placedBy != null) {
      takens[placedBy] += 1;
    }
    return this.probe(nextBlock, nextPos);
  };

  Roads.prototype.getContra = function(pos) {
    var dic;
    dic = {
      0: 2,
      1: 3,
      2: 0,
      3: 1
    };
    return dic.pos;
  };

  Roads.prototype.renderFinishedRoad = function() {
    return console.log('get the fucking follower');
  };

  return Roads;

})();

Road = (function() {
  function Road() {}

  Road.prototype.id = 0;

  Road.prototype.isVertex = false;

  Road.prototype.position = 0;

  return Road;

})();

Users = (function() {
  function Users(num) {
    var i, _i, _ref;
    this.num = num;
    for (i = _i = 1, _ref = this.num; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
      this._users.push(new User(i));
    }
  }

  Users.prototype._users = [];

  Users.prototype.nextUser = function() {
    if (this.num === 0) {
      this.num = this._users.length;
    }
    console.log(this.num);
    return this._users[--this.num];
  };

  Users.prototype.scoring = function(type, id, score) {
    console.log(this._users);
    return this._users[id - 1][type] += score;
  };

  Users.prototype.getScore = function(id) {
    return this._users[id - 1]['road'] + this._users[id - 1]['castle'];
  };

  return Users;

})();

User = (function() {
  function User(id) {
    this.id = id;
  }

  User.prototype.id = 0;

  User.prototype.field = 0;

  User.prototype.castle = 0;

  User.prototype.road = 0;

  User.prototype.cloister = 0;

  User.prototype.total = 0;

  User.prototype.followers = [];

  User.prototype.setUI = function() {
    var selector;
    selector = 'player' + this.id;
    return document.getElementById(selector).innerHTML = 'player ' + this.id + ' ongoing';
  };

  User.prototype.getBlock = function(block) {
    return this.placeBlock(block);
  };

  return User;

})();