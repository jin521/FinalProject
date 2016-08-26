
var gapp;

var createUniverse = function() {


  if ($("#output").length === 0) {
    console.log('not creating universe');
    return ;
  }

    var app = app || {};

    app.step = 0;

    var $el;

    app.visibleParticles = 0; // will be set to length of posts (in AJAX handler)
    app.hiddenParticles = 100;
    app.totalParticles = 0;

    app.particleDistribution = 300; //particles will be floating in this range -300 to 300, we are hiding the "invisiable"ones beyong 10000


    app.all_posts = []; //data from database , see Ajax call


    var raycaster = new THREE.Raycaster(); //Raycasting is a rendering technique to create a 3D perspective in a 2D map.

    var mouse = new THREE.Vector3();

    raycaster.params.Points.threshold = 50; // thresholds is an array with the same size as the number of points

    var interactables = [];



    app.controller = {
        rotationSpeed: 0.02,
        bouncingSpeed: 0.02
    };

    app.init = function() {

        console.log("hello w0rld");

        app.scene = new THREE.Scene();

        app.width = window.innerWidth;
        app.height = window.innerHeight;


        app.camera = new THREE.PerspectiveCamera(60, app.width / app.height, 0.1, 4500);
        // field of view
        // screen ratio
        // near
        // far


        app.camera.position.x = -30;
        app.camera.position.y = 40;
        app.camera.position.z = 30;

        app.camera.lookAt(app.scene.position);

        app.renderer = new THREE.WebGLRenderer();

        app.renderer.setSize(app.width, app.height);
        app.renderer.setClearColor(0x000000); // bg color
        app.renderer.shadowMap.enabled = false; // disabled by default



        app.axes = new THREE.AxisHelper(40);
        // app.scene.add( app.axes );



            app.light = new THREE.AmbientLight();
            app.light.color.setRGB( 0.7, 0.7, 0.7 );
            app.scene.add( app.light );


        var sphereGeometry = new THREE.SphereGeometry(16, 30, 30);
        var sphereMaterial = new THREE.MeshLambertMaterial({
            color: 0xFFFFFF,
            wireframe: false,
            map: THREE.ImageUtils.loadTexture("/assets/earth.jpg")
        });


        app.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        app.sphere.position.set(20, 4, 2);
        app.sphere.castShadow = false;

        app.scene.add(app.sphere);

        console.log(app.sphere, sphereMaterial);


        // create the geometry sphere for background
        var bggeometry = new THREE.SphereGeometry(2000, 32, 32)
            // create the material, using a texture of startfield
        var bgmaterial  = new THREE.MeshBasicMaterial()
        bgmaterial.map  = THREE.ImageUtils.loadTexture('/assets/nasa.jpg')
        bgmaterial.side  = THREE.BackSide
            // create the mesh based on geometry and material
        var bgmesh  = new THREE.Mesh(bggeometry, bgmaterial)

        app.scene.add(bgmesh);


        //Ajax to fetch data from Database
        $.ajax('/getposts').done(function(response) {

            // we have to wait for our ajax response before we can do the rest of the three.js code below:

            app.all_posts = response.posts;

            app.visibleParticles = app.all_posts.length;
            app.totalParticles = app.visibleParticles + app.hiddenParticles;

            // console.log('all_posts', app.all_posts);

            app.particleSystem = app.createParticleSystem();
            app.scene.add(app.particleSystem);

            app.controls = new THREE.OrbitControls(app.camera, app.renderer.domElement);
            app.controls.minDistance = 100;
            app.controls.maxDistance = 1600;

            app.gui = new dat.GUI(); //graphical user interface
            app.gui.add(app.controller, 'rotationSpeed', 0, 0.2);
            app.gui.add(app.controller, 'bouncingSpeed', 0, 2.0);
            //
            app.stats = app.addStats(); //stats-statistics

            document.getElementById("output").appendChild(app.renderer.domElement);
            app.animate();

        });



    };




    app.animate = function() {

        app.stats.update();

        app.step += app.controller.bouncingSpeed;

        app.sphere.rotation.y += app.controller.rotationSpeed;

        app.animateParticles();
        // app.animateCubes();

        app.renderer.render(app.scene, app.camera);

        requestAnimationFrame(app.animate);

    };




  //Find specific point between 2 points
  // http://stackoverflow.com/questions/27426053/find-specific-point-between-2-points-three-js
  app.getPointInBetweenByPerc = function(pointA, pointB, percentage) {
      var dir = pointB.clone().sub(pointA);
      var len = dir.length();
      dir = dir.normalize().multiplyScalar(len*percentage);
      return pointA.clone().add(dir);

  }


    app.randRange = function(min, max) {
        var range = max - min;
        return min + (Math.random() * range);
    };


        // it is actually unhiding parcticles
    app.createParticle = function() {


        console.log('createParticle', app.visibleParticles, app.particleSystem.geometry.vertices[app.visibleParticles])
        var particle = app.particleSystem.geometry.vertices[app.visibleParticles];
        particle.hidden = false;
        console.log(app.camera.position, particle);

        //make velocity to  be 0 when the particle is generated
        particle.vx = particle.vy = particle.vz = 0;

        app.particleSystem.geometry.colors[app.visibleParticles].setRGB(0, 0, 1.0);
        app.particleSystem.geometry.colorsNeedUpdate = true;


        //creating a pposition betwwen Point A ( camera) and PointB ( origin),distance percentage 2% from camera position
        particle.copy( app.getPointInBetweenByPerc(app.camera.position, new THREE.Vector3(0,0,0), 0.2) );


        console.log(particle);
        app.visibleParticles++;

    };




    app.createParticleSystem = function() {

      console.log(app.camera);

        var particles = new THREE.Geometry(); // a basic collection of vertices (i.e. points)

        particles.userData = []; // to keep track of particles

        var pcolours = [];
        var x, y, z;
        var particle;

        for (var p = 0; p < app.totalParticles; p++) {


            // var x = app.randRange(-300, 300);

            if (p < app.visibleParticles) {

                // visible particles

                x = app.randRange(-app.particleDistribution, app.particleDistribution);
                y = app.randRange(-app.particleDistribution, app.particleDistribution);
                z = app.randRange(-app.particleDistribution, app.particleDistribution);

                particle = new THREE.Vector3(x, y, z); // create this specific vertex (vertex = single of vertices)

                particle.vx = app.randRange(-0.2, 0.2);
                particle.vy = app.randRange(-0.2, 0.2);
                particle.vz = app.randRange(-0.2, 0.2);

                particle.hidden = false;

                particle.textcontent = app.all_posts[p].description;

            } else {

                // hidden particles

                x = 10000;
                y = 10000;
                z = 10000;

                particle = new THREE.Vector3(x, y, z); // create this specific vertex (vertex = single of vertices)

                particle.vx = 0;
                particle.vy = 0;
                particle.vz = 0;

                particle.hidden = true;

            }


            particles.userData.push(particle);

            // particle.textcontent = @tweet.text;
            particles.vertices.push(particle); // add to our collection of vertices

            pcolours[p] = new THREE.Color(1.0, 1.0, 1.0); // initialise a colour for each particle


        }

        var particleMaterial = new THREE.PointsMaterial({
            // color: 0xff8080,
            vertexColors: THREE.VertexColors, // tell the material to pay attention to individual particle colours
            size: 30,
            blending: THREE.AdditiveBlending, // just obey
            transparent: true,
            alphaTest: 0.5, // also obey
            map: THREE.ImageUtils.loadTexture("/assets/particle.png")
        });


        // };

        var particleSystem = new THREE.Points(particles, particleMaterial);

        particleSystem.geometry.colors = pcolours; // set the geometry colours from our init array

        // for(var i = 0; i < particleSystem.geometry.vertices.length; i++) {
        //
        //   particleSystem.geometry.colors[i] = new THREE.Color();
        //   particleSystem.geometry.colors[i].setRGB(1.0, 1.0, 1.0); // Math.random(), Math.random(), Math.random() );
        //   // console.log(   particleSystem.geometry.colors[i] );
        //
        //
        // }

        return particleSystem;



    };





    app.animateParticles = function() {

        var verts = app.particleSystem.geometry.vertices;

        for (var i = 0; i < verts.length; i++) {

            var vert = verts[i];
            //
            // if( vert.y  < - app.particleDistribution ){
            //   vert.y = app.randRange( -app.particleDistribution, app.particleDistribution );
            // }

            // vert.y -= app.controller.rotationSpeed;

            var dist = Math.sqrt(vert.x * vert.x + vert.y * vert.y + vert.z * vert.z); //distance = squareroot(   )

            var force = (10.0 / (dist * dist)) * -0.8; //changed from -0.05 to -0.8
            //
            vert.vx += force * vert.x;
            // vert.vy += force * vert.y;
            // vert.vz += force * vert.z;


            vert.x += vert.vx * app.controller.rotationSpeed * 20;
            vert.y += vert.vy * app.controller.rotationSpeed * 20;
            vert.z += vert.vz * app.controller.rotationSpeed * 20;

        }

        app.particleSystem.geometry.verticesNeedUpdate = true;
    };


    app.onResize = function() {

        app.width = window.innerWidth;
        app.height = window.innerHeight;

        app.camera.aspect = app.width / app.height;
        app.camera.updateProjectionMatrix();

        app.renderer.setSize(app.width, app.height);

    };


    app.addStats = function() {

        var stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '60px';

        document.getElementById("stats").appendChild(stats.domElement);

        return stats;
    };

    window.addEventListener("resize", app.onResize);


    $(document).ready(function() {
        app.init();
    });

    $("#output").mousedown(function(e) {
        console.log('mousedown');
        e.preventDefault();
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        mouse.x = (e.clientX / app.renderer.domElement.width) * 2 - 1;
        mouse.y = -(e.clientY / app.renderer.domElement.height) * 2 + 1;
        mouse.z = 0.5;


        // update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, app.camera);
        // calculate objects intersecting the picking ray
        var intersects = raycaster.intersectObjects(app.scene.children);

        if (intersects.length > 0) {

            //      //console.log( 'intersects', intersects );
            //      // Points.js::raycast() doesn't seem to sort this correctly atm,
            //      // but how many points are found depends on the threshold set
            //      // on the raycaster as well
            //
            //      intersects = intersects.sort( function( a, b ) {
            //          return a.distanceToRay - b.distanceToRay;
            //      });  // sort into an array with the nearest point at the start

            var particle = intersects[0];//closed to ray



            console.log(particle.index, particle);

            console.log('got a click on particle',
                //app.particleSystem.geometry.vertices[ particle.index],
                particle.index, particle,
                app.particleSystem.geometry.vertices[particle.index].textcontent
            );

            //  debugger;

            app.particleSystem.geometry.colors[particle.index].setRGB(Math.random(), Math.random(), Math.random());

            var vertex = app.particleSystem.geometry.vertices[particle.index];
            vertex.vx = vertex.vy = vertex.vz = 0;

            app.particleSystem.geometry.colorsNeedUpdate = true;

            var divXY = toScreenXY(vertex, app.camera, app.renderer.domElement);
            //$el is now a global varible( not having var in front)
            $el = $('<div id="stuff" class="message">').css({

                    top: divXY.y + "px",
                    left: divXY.x + "px",

                })
                .html(app.particleSystem.geometry.vertices[particle.index].textcontent)
                .appendTo($('body'));

                setTimeout(function() {
                  $(".message").remove();
                }, 3000);

                console.log('$el', $el);

        }

    })

        // .on('mouseup', function () {
        //         var $element = $el; //making a copy of $el
        //         setTimeout(function() {
        //             $element.remove();
        //         }, 800);
        // });


      ////////////////////////when mouse over the particle closest to ray will change color /highlighted

                $("output").on("mouseover", function(event) {
                    console.log('mouseover');

                    // calculate mouse position in normalized device coordinates
                    // (-1 to +1) for both components
                    mouse.x = (e.clientX / app.renderer.domElement.width) * 2 - 1;
                    mouse.y = -(e.clientY / app.renderer.domElement.height) * 2 + 1;
                    mouse.z = 0.5;


                    // update the picking ray with the camera and mouse position
                    raycaster.setFromCamera(mouse, app.camera);
                    // calculate objects intersecting the picking ray
                    var intersects = raycaster.intersectObjects(app.scene.children);

                    if (intersects.length > 0) {

                        var particle = intersects[0];//closed to ray
                        console.log('this is the closest particle to ray',

                            particle.index, particle,
                            app.particleSystem.geometry.vertices[particle.index].textcontent
                        );

                        //  debugger;

                        app.particleSystem.geometry.colors[particle.index].setRGB(0,0,1.0);
                        app.particleSystem.geometry.colorsNeedUpdate = true;
                    }

                });





    //converting 3d position to 2d screen position, from http://stackoverflow.com/questions/11534000/three-js-converting-3d-position-to-2d-screen-position
    function toScreenXY(position, camera, div) {
        var pos = position.clone();
        projScreenMat = new THREE.Matrix4();
        projScreenMat.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
        pos.applyProjection(projScreenMat);

        var offset = findOffset(div);

        return {
            x: (pos.x + 1) * div.width / 2 + offset.left,
            y: (-pos.y + 1) * div.height / 2 + offset.top
        };

    }

    function findOffset(element) {
        var pos = new Object();
        pos.left = pos.top = 0;
        if (element.offsetParent) {
            do {
                pos.left += element.offsetLeft;
                pos.top += element.offsetTop;
            } while (element = element.offsetParent);
        }
        return pos;
    }


    $("#enterbutton").on("click", function(event) {

      // event.preventDefault();

      var message = $('#post_text').val();

      $.ajax({
        url: '/posts',
        method: 'POST',
        dataType: 'json',
        data: { post: { description: message } }
      })
      .done(function(d){
        console.log('success', d);
        app.createParticle();
        $('#post_text').val('');

      })
      .fail(function(d){
        console.log('fail', d);
      });

    });


gapp = app;

}; //end of createUniverse

$(document).ready(createUniverse);



// var gapp;
//
// var createUniverse = function() {
//
//
//   if ($("#output").length === 0) {
//     console.log('not creating universe');
//     return ;
//   }
//
//     var app = app || {};
//
//     app.step = 0;
//
//     app.visibleParticles = 0; // will be set to length of posts (in AJAX handler)
//     app.hiddenParticles = 100;
//     app.totalParticles = 0;
//
//     app.particleDistribution = 300;
//     // app.numCubes = 2000;POs
//     // app.cubeDistribution = 100;
//
//     app.all_posts = [];
//
//
//     var raycaster = new THREE.Raycaster(); //Raycasting is a rendering technique to create a 3D perspective in a 2D map.
//     // This may need further tweaking (depending on scale etc)
//     var mouse = new THREE.Vector3();
//
//     raycaster.params.Points.threshold = 50; // thresholds is an array with the same size as the number of points
//
//     var interactables = [];
//
//
//
//     app.controller = {
//         rotationSpeed: 0.02,
//         bouncingSpeed: 0.02
//     };
//
//     app.init = function() {
//
//         console.log("hello w0rld");
//
//         app.scene = new THREE.Scene();
//
//         app.width = window.innerWidth;
//         app.height = window.innerHeight;
//
//
//         app.camera = new THREE.PerspectiveCamera(60, app.width / app.height, 0.1, 4500);
//         // field of view
//         // screen ratio
//         // near
//         // far
//
//
//         app.camera.position.x = -30;
//         app.camera.position.y = 40;
//         app.camera.position.z = 30;
//
//         app.camera.lookAt(app.scene.position);
//
//         app.renderer = new THREE.WebGLRenderer();
//
//         app.renderer.setSize(app.width, app.height);
//         app.renderer.setClearColor(0x000000); // bg color
//         app.renderer.shadowMap.enabled = false; // disabled by default
//
//
//
//         app.axes = new THREE.AxisHelper(40);
//         // app.scene.add( app.axes );
//
//         // var planeGeometry = new THREE.PlaneGeometry( 120, 20 ); // 120 x 20 plane
//         // var planeMaterial = new THREE.MeshLambertMaterial({
//         //   color: 0xCFD8DC  // hex colour, kind of a grey
//         // });
//         //
//         // app.plane = new THREE.Mesh( planeGeometry, planeMaterial ); // bring together shape and material
//         //
//         // app.plane.rotation.x = -0.5 * Math.PI; //don't ask, it's because of math
//         // app.plane.position.x = 15;
//         // app.plane.position.y = 0;
//         // app.plane.position.z = 0;
//         // app.plane.receiveShadow = true;
//         //
//         // app.scene.add( app.plane );
//
//
//         // var cubeGeometry = new THREE.BoxGeometry( 4, 4, 4 );
//         // var cubeMaterial = new THREE.MeshLambertMaterial({
//         //   color: 0xFF8F00,
//         //   wireframe: false
//         // });
//
//         // app.cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
//         //
//         // app.cube.position.set( 0, 0, 0 );
//         // app.cube.castShadow = false;
//         //
//         // app.scene.add( app.cube );
//
//         // create the geometry sphere for sphere
//
//
//             app.light = new THREE.AmbientLight();
//             app.light.color.setRGB( 0.7, 0.7, 0.7 );
//             app.scene.add( app.light );
//
//
//         var sphereGeometry = new THREE.SphereGeometry(16, 30, 30);
//         var sphereMaterial = new THREE.MeshLambertMaterial({
//             color: 0xFFFFFF,
//             wireframe: false,
//             map: THREE.ImageUtils.loadTexture("/assets/earth.jpg")
//         });
//
//
//         app.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
//
//         app.sphere.position.set(20, 4, 2);
//         app.sphere.castShadow = false;
//
//         app.scene.add(app.sphere);
//
//         console.log(app.sphere, sphereMaterial);
//
//
//         // create the geometry sphere for background
//         var bggeometry = new THREE.SphereGeometry(2000, 32, 32)
//             // create the material, using a texture of startfield
//         var bgmaterial  = new THREE.MeshBasicMaterial()
//         bgmaterial.map  = THREE.ImageUtils.loadTexture('/assets/nasa.jpg')
//         bgmaterial.side  = THREE.BackSide
//             // create the mesh based on geometry and material
//         var bgmesh  = new THREE.Mesh(bggeometry, bgmaterial)
//
//         app.scene.add(bgmesh);
//
//
//
//
//
//         $.ajax('/getposts').done(function(response) {
//
//             // we have to wait for our ajax response before we can do the rest of the three.js code below:
//
//             app.all_posts = response.posts;
//
//             app.visibleParticles = app.all_posts.length;
//             app.totalParticles = app.visibleParticles + app.hiddenParticles;
//
//             // console.log('all_posts', app.all_posts);
//
//             app.particleSystem = app.createParticleSystem();
//             app.scene.add(app.particleSystem);
//
//             app.controls = new THREE.OrbitControls(app.camera, app.renderer.domElement);
//             app.controls.minDistance = 100;
//             app.controls.maxDistance = 1600;
//
//             app.gui = new dat.GUI(); //graphical user interface
//             app.gui.add(app.controller, 'rotationSpeed', 0, 0.2);
//             app.gui.add(app.controller, 'bouncingSpeed', 0, 2.0);
//             //
//             app.stats = app.addStats(); //stats-statistics
//
//             document.getElementById("output").appendChild(app.renderer.domElement);
//             app.animate();
//
//         });
//
//
//
//     };
//
//
//
//
//     app.animate = function() {
//
//         app.stats.update();
//
//
//         app.step += app.controller.bouncingSpeed;
//
//
//
//         app.sphere.rotation.y += app.controller.rotationSpeed;
//
//         app.animateParticles();
//         // app.animateCubes();
//
//         app.renderer.render(app.scene, app.camera);
//
//         requestAnimationFrame(app.animate);
//
//     };
//
//     // app.animateCubes = function(){
//     //
//     //   for( var i = 0; i < app.cubeFleet.length; i++ ){
//     //     app.cubeFleet[i].rotation.x += app.cubeFleet[i].rotate_step;
//     //     app.cubeFleet[i].rotation.y += app.cubeFleet[i].rotate_step;
//     //     app.cubeFleet[i].rotation.z += app.cubeFleet[i].rotate_step;
//     //   }
//     // };
//     //
//     // app.createCubeFleet = function( cubeCount, cubeDistribution ){
//     //
//     // // console.log( cubeCount, cubeDistribution );
//     //
//     //   var cubes = new Array( cubeCount );
//     //
//     //   for( var i = 0; i < cubes.length; i++ ){
//     //
//     //     var cubeSize = app.randRange( 2, 12 );
//     //     var cubeGeometry = new THREE.BoxGeometry( cubeSize, cubeSize, cubeSize );
//     //     var cubeMaterial = new THREE.MeshLambertMaterial({
//     //       // color: 0xFF8F00,
//     //       wireframe: false
//     //     });
//     //
//     //     cubes[i] = new THREE.Mesh( cubeGeometry, cubeMaterial );
//     //
//     //     cubes[i].material.color.setRGB( Math.random(), Math.random(), Math.random() );
//     //
//     //     cubes[i].position.set(
//     //       app.randRange( -cubeDistribution, cubeDistribution ),
//     //       app.randRange( -cubeDistribution, cubeDistribution ),
//     //       app.randRange( -cubeDistribution, cubeDistribution )
//     //      );
//     //     // console.log( cubes[i].position )
//     //     cubes[i].castShadow = false;
//     //
//     //     cubes[i].rotate_step = app.randRange( -0.1, 0.1 );
//     //
//     //
//     //   } // end for
//     //
//     //
//     //   return cubes;
//     // };
//
//
//
//
//
//   //Find specific point between 2 points
//   // http://stackoverflow.com/questions/27426053/find-specific-point-between-2-points-three-js
//   app.getPointInBetweenByPerc = function(pointA, pointB, percentage) {
//       var dir = pointB.clone().sub(pointA);
//       var len = dir.length();
//       dir = dir.normalize().multiplyScalar(len*percentage);
//       return pointA.clone().add(dir);
//
//   }
//
//
//     app.randRange = function(min, max) {
//         var range = max - min;
//         return min + (Math.random() * range);
//     };
//
//
//
//     app.createParticle = function() {
//
//
//         console.log('createParticle', app.visibleParticles, app.particleSystem.geometry.vertices[app.visibleParticles])
//         var particle = app.particleSystem.geometry.vertices[app.visibleParticles];
//         particle.hidden = false;
//         console.log(app.camera.position, particle);
//
//         //make velocity to  be 0 when the particle is generated
//         particle.vx = particle.vy = particle.vz = 0;
//         // particle.setRGB(0, 0, 255)
//         //creating a pposition betwwen Point A ( camera) and PointB ( origin),distance percentage 1% from camera position
//         particle.copy( app.getPointInBetweenByPerc(app.camera.position, new THREE.Vector3(0,0,0), 0.2) );
//
//
//         console.log(particle);
//         app.visibleParticles++;
//
//     };
//
//
//
//
//     app.createParticleSystem = function() {
//
//       console.log(app.camera);
//
//         var particles = new THREE.Geometry(); // a basic collection of vertices (i.e. points)
//
//         particles.userData = []; // to keep track of particles
//
//         var pcolours = [];
//         var x, y, z;
//         var particle;
//
//         for (var p = 0; p < app.totalParticles; p++) {
//
//
//             // var x = app.randRange(-300, 300);
//
//             if (p < app.visibleParticles) {
//
//                 // visible particles
//
//                 x = app.randRange(-app.particleDistribution, app.particleDistribution);
//                 y = app.randRange(-app.particleDistribution, app.particleDistribution);
//                 z = app.randRange(-app.particleDistribution, app.particleDistribution);
//
//                 particle = new THREE.Vector3(x, y, z); // create this specific vertex (vertex = single of vertices)
//
//                 particle.vx = app.randRange(-0.2, 0.2);
//                 particle.vy = app.randRange(-0.2, 0.2);
//                 particle.vz = app.randRange(-0.2, 0.2);
//
//                 particle.hidden = false;
//
//                 particle.textcontent = app.all_posts[p].description;
//
//             } else {
//
//                 // hidden particles
//
//                 x = 10000;
//                 y = 10000;
//                 z = 10000;
//
//                 particle = new THREE.Vector3(x, y, z); // create this specific vertex (vertex = single of vertices)
//
//                 particle.vx = 0;
//                 particle.vy = 0;
//                 particle.vz = 0;
//
//                 particle.hidden = true;
//
//             }
//
//
//             particles.userData.push(particle);
//
//             // particle.textcontent = @tweet.text;
//             particles.vertices.push(particle); // add to our collection of vertices
//
//             pcolours[p] = new THREE.Color(1.0, 1.0, 1.0); // initialise a colour for each particle
//
//
//         }
//
//         var particleMaterial = new THREE.PointsMaterial({
//             // color: 0xff8080,
//             vertexColors: THREE.VertexColors, // tell the material to pay attention to individual particle colours
//             size: 30,
//             blending: THREE.AdditiveBlending, // just obey
//             transparent: true,
//             alphaTest: 0.5, // also obey
//             map: THREE.ImageUtils.loadTexture("/assets/particle.png")
//         });
//
//
//         // };
//
//         var particleSystem = new THREE.Points(particles, particleMaterial);
//
//         particleSystem.geometry.colors = pcolours; // set the geometry colours from our init array
//
//         // for(var i = 0; i < particleSystem.geometry.vertices.length; i++) {
//         //
//         //   particleSystem.geometry.colors[i] = new THREE.Color();
//         //   particleSystem.geometry.colors[i].setRGB(1.0, 1.0, 1.0); // Math.random(), Math.random(), Math.random() );
//         //   // console.log(   particleSystem.geometry.colors[i] );
//         //
//         //
//         // }
//
//         return particleSystem;
//
//
//
//     };
//
//
//
//
//
//     app.animateParticles = function() {
//
//         var verts = app.particleSystem.geometry.vertices;
//
//         for (var i = 0; i < verts.length; i++) {
//
//             var vert = verts[i];
//             //
//             // if( vert.y  < - app.particleDistribution ){
//             //   vert.y = app.randRange( -app.particleDistribution, app.particleDistribution );
//             // }
//
//             // vert.y -= app.controller.rotationSpeed;
//
//             var dist = Math.sqrt(vert.x * vert.x + vert.y * vert.y + vert.z * vert.z); //distance = squareroot(   )
//
//             var force = (10.0 / (dist * dist)) * -0.8; //changed from -0.05 to -0.8
//             //
//             vert.vx += force * vert.x;
//             // vert.vy += force * vert.y;
//             // vert.vz += force * vert.z;
//
//
//             vert.x += vert.vx * app.controller.rotationSpeed * 20;
//             vert.y += vert.vy * app.controller.rotationSpeed * 20;
//             vert.z += vert.vz * app.controller.rotationSpeed * 20;
//
//         }
//
//         app.particleSystem.geometry.verticesNeedUpdate = true;
//     };
//
//
//     app.onResize = function() {
//
//         app.width = window.innerWidth;
//         app.height = window.innerHeight;
//
//         app.camera.aspect = app.width / app.height;
//         app.camera.updateProjectionMatrix();
//
//         app.renderer.setSize(app.width, app.height);
//
//     };
//
//
//     app.addStats = function() {
//
//         var stats = new Stats();
//         stats.setMode(0);
//         stats.domElement.style.position = 'absolute';
//         stats.domElement.style.left = '0px';
//         stats.domElement.style.top = '60px';
//
//         document.getElementById("stats").appendChild(stats.domElement);
//
//         return stats;
//     };
//
//     window.addEventListener("resize", app.onResize);
//
//
//     $(document).ready(function() {
//         app.init();
//     });
//
//     $("#output").mousedown(function(e) {
//         console.log('mousedown');
//         e.preventDefault();
//         // calculate mouse position in normalized device coordinates
//         // (-1 to +1) for both components
//         mouse.x = (e.clientX / app.renderer.domElement.width) * 2 - 1;
//         mouse.y = -(e.clientY / app.renderer.domElement.height) * 2 + 1;
//         mouse.z = 0.5;
//
//
//         // update the picking ray with the camera and mouse position
//         raycaster.setFromCamera(mouse, app.camera);
//         // calculate objects intersecting the picking ray
//         var intersects = raycaster.intersectObjects(app.scene.children);
//
//         if (intersects.lemmength > 0) {
//
//             //      //console.log( 'intersects', intersects );
//             //      // Points.js::raycast() doesn't seem to sort this correctly atm,
//             //      // but how many points are found depends on the threshold set
//             //      // on the raycaster as well
//             //
//             //      intersects = intersects.sort( function( a, b ) {
//             //          return a.distanceToRay - b.distanceToRay;
//             //      });  // sort into an array with the nearest point at the start
//
//             var particle = intersects[0];
//             //  debugger;
//             console.log('got a click on particle',
//                 //app.particleSystem.geometry.vertices[ particle.index],
//                 particle.index, particle,
//                 app.particleSystem.geometry.vertices[particle.index].textcontent
//             );
//
//             //  debugger;
//
//             app.particleSystem.geometry.colors[particle.index].setRGB(Math.random(), Math.random(), Math.random());
//
//             var vertex = app.particleSystem.geometry.vertices[particle.index];
//             vertex.vx = vertex.vy = vertex.vz = 0;
//
//             app.particleSystem.geometry.colorsNeedUpdate = true;
//
//             var divXY = toScreenXY(vertex, app.camera, app.renderer.domElement);
//             //$el is now a global varible( not having var in front)
//             $el = $('<div id="stuff" class="message">').css({
//
//                     top: divXY.y + "px",
//                     left: divXY.x + "px",
//
//                 })
//                 .html(app.particleSystem.geometry.vertices[particle.index].textcontent)
//                 .appendTo($('body'));
//
//
//         }
//
//     }).on('mouseup', function () {
//             var $element = $el; //making a copy of $el
//             setTimeout(function() {
//                 $element.remove();
//             }, 800);
//     });
//
//     //  converting 3d position to 2d screen position, from http://stackoverflow.com/questions/11534000/three-js-converting-3d-position-to-2d-screen-position
//     function toScreenXY(position, camera, div) {
//         var pos = position.clone();
//         projScreenMat = new THREE.Matrix4();
//         projScreenMat.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
//         pos.applyProjection(projScreenMat);
//
//         var offset = findOffset(div);
//
//         return {
//             x: (pos.x + 1) * div.width / 2 + offset.left,
//             y: (-pos.y + 1) * div.height / 2 + offset.top
//         };
//
//     }
//
//     function findOffset(element) {
//         var pos = new Object();
//         pos.left = pos.top = 0;
//         if (element.offsetParent) {
//             do {
//                 pos.left += element.offsetLeft;
//                 pos.top += element.offsetTop;
//             } while (element = element.offsetParent);
//         }
//         return pos;
//     }
//
//
//     $("#enterbutton").on("click", function(event) {
//
//       // event.preventDefault();
//
//       var message = $('#post_text').val();
//
//       $.ajax({
//         url: '/posts',
//         method: 'POST',
//         dataType: 'json',
//         data: { post: { description: message } }
//       })
//       .done(function(d){
//         console.log('success', d);
//         app.createParticle();
//
//       })
//       .fail(function(d){
//         console.log('fail', d);
//       });
//
//     });
//
//
// gapp = app;
//
//
// }; //end of createUniverse
//
// $(document).ready(createUniverse);
