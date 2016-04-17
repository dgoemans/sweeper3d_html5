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

        }

        Cube.DIMENSIONS = 4;


        Cube.prototype.update = function(delta)
        {
            this.root.rotateX(0.05*delta);

            this.root.rotateY(0.07*delta);
        };


        Cube.prototype.updateInput = function(input, activate)
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
                        activate ? this.activate(tile) : this.select(tile);

                        break;
                    }
                };
            }

        };

        Cube.prototype.activate = function(tile)
        {
            this.selected = null;

            tile.activate();
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

        return Cube;
    }
);