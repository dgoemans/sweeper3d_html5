define(["Three",
    "game/Tile"],
    function(Three, Tile)
    {
        function Cube(threeScene, threeCamera, x, y, z)
        {
            this.tiles = {};

            this.root = new Three.Object3D();

            this.camera = threeCamera;

            this.selected = null;

            this.raycaster = new Three.Raycaster();

            this.inputPosition = new Three.Vector2();

            threeScene.add(this.root);

            var dimensions = Cube.DIMENSIONS;

            var halfDimensions = dimensions/2 - 0.5;

            for(var z=0; z<dimensions; z++)
            {
                for(var y=0; y<dimensions; y++)
                {
                    for(var x=0; x<dimensions; x++)
                    {
                        var tile = new Tile(this.root, x - halfDimensions, y - halfDimensions, z - halfDimensions);

                        this.tiles[x.toString() + y.toString() + z.toString()] = tile;
                    }
                }
            }

            this.generated = false;
        }

        Cube.DIMENSIONS = 4;

        Cube.prototype.update = function(delta)
        {
        };


        Cube.prototype.updateInput = function(input)
        {
            this.deselect();

            this.inputPosition.x = ( input.global.x / window.innerWidth ) * 2 - 1;
            this.inputPosition.y = - ( input.global.y / window.innerHeight ) * 2 + 1;

            // update the picking ray with the camera and mouse position
            this.raycaster.setFromCamera( this.inputPosition, this.camera );

            // calculate objects intersecting the picking ray
            var intersects = this.raycaster.intersectObjects( this.root.children );

            var closest = null;

            var distance = Infinity;

            intersects.forEach(function(object){
                if(object.distance < distance)
                {
                    closest = object.object;
                    distance = object.distance;
                }
            }, this);

            if (closest)
            {
                for(var key in this.tiles)
                {
                    var tile = this.tiles[key];

                    if (tile.sceneObject === closest)
                    {
                        this.select(tile);

                        break;
                    }
                };
            }

            return this.selected;
        };

        Cube.prototype.generate = function()
        {
            var numBombs = 5;

            // Place the bombs
            for(var i=0; i<numBombs; i++)
            {
                var x = Math.floor(Math.random() * Cube.DIMENSIONS);

                var y = Math.floor(Math.random() * Cube.DIMENSIONS);

                var z = Math.floor(Math.random() * Cube.DIMENSIONS);

                var key = x.toString() + y.toString() + z.toString();

                if (this.tiles[key] === this.selected || this.tiles[key].isBomb)
                {
                    i--;
                    continue;
                }
                else
                {
                    this.tiles[key].setBomb();
                }
            }

            // Generate the numbers
            for(var key in this.tiles)
            {
                if (this.tiles[key].isBomb)
                {
                    continue;
                }

                var x = parseInt(key[0]);

                var y = parseInt(key[1]);

                var z = parseInt(key[2]);

                var neighbourBombs = 0;

                if (this.tileAbove(x,y,z) && this.tileAbove(x,y,z).isBomb)
                {
                    neighbourBombs++;
                }
                if (this.tileBelow(x,y,z) && this.tileBelow(x,y,z).isBomb)
                {
                    neighbourBombs++;
                }
                if (this.tileLeft(x,y,z) && this.tileLeft(x,y,z).isBomb)
                {
                    neighbourBombs++;
                }
                if (this.tileRight(x,y,z) && this.tileRight(x,y,z).isBomb)
                {
                    neighbourBombs++;
                }
                if (this.tileFront(x,y,z) && this.tileFront(x,y,z).isBomb)
                {
                    neighbourBombs++;
                }
                if (this.tileBack(x,y,z) && this.tileBack(x,y,z).isBomb)
                {
                    neighbourBombs++;
                }

                this.tiles[key].setValue(neighbourBombs);
            }

            this.generated = true;
        };

        Cube.prototype.tileAbove = function(x,y,z)
        {
            return this.tiles[x.toString() + (y+1).toString() + z.toString()];
        };

        Cube.prototype.tileBelow = function(x,y,z)
        {
            return this.tiles[x.toString() + (y-1).toString() + z.toString()];
        };

        Cube.prototype.tileRight = function(x,y,z)
        {
            return this.tiles[(x+1).toString() + y.toString() + z.toString()];
        };

        Cube.prototype.tileLeft = function(x,y,z)
        {
            return this.tiles[(x-1).toString() + y.toString() + z.toString()];
        };

        Cube.prototype.tileFront = function(x,y,z)
        {
            return this.tiles[x.toString() + y.toString() + (z+1).toString()];
        };

        Cube.prototype.tileBack = function(x,y,z)
        {
            return this.tiles[x.toString() + y.toString() + (z-1).toString()];
        };

        Cube.prototype.clearSelected = function()
        {
            if (!this.generated)
            {
                this.generate();
            }

            var tile = this.selected;

            this.selected = null;

            tile.clear();
        };

        Cube.prototype.flagSelected = function()
        {
            var tile = this.selected;

            this.selected = null;

            tile.flag();
        };

        Cube.prototype.select = function(tile)
        {
            this.selected = tile;

            tile.select();
        };

        Cube.prototype.deselect = function(tile)
        {
            var tile = tile || this.selected;

            this.selected = null;

            if (tile)
            {
                tile.deselect();
            }
        };

        Cube.prototype.rotate = function(x,y)
        {
            var rotator = new Three.Quaternion();

            rotator.setFromEuler(new Three.Euler(y,x,0));

            rotator.multiply(this.root.quaternion);

            this.root.quaternion.copy(rotator);
        };

        return Cube;
    }
);