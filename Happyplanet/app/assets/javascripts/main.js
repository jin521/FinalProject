
var app = app || {};

app.step = 0;
app.numParticles = 1000;
app.visibleParticles = 23;
app.particleDistribution = 300;
// app.numCubes = 2000;
// app.cubeDistribution = 100;



 var raycaster = new THREE.Raycaster();  //Raycasting is a rendering technique to create a 3D perspective in a 2D map.
 // This may need further tweaking (depending on scale etc)
 var mouse = new THREE.Vector2();

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

  app.camera = new THREE.PerspectiveCamera(60, app.width / app.height, 0.1, 2000);
  // field of view
  // screen ratio
  // near
  // far


  app.camera.position.x = -30;
  app.camera.position.y = 40;
  app.camera.position.z = 30;

  app.camera.lookAt( app.scene.position );

  app.renderer = new THREE.WebGLRenderer();

  app.renderer.setSize( app.width, app.height );
  app.renderer.setClearColor( 0x000000); // bg color
  app.renderer.shadowMap.enabled = false;  // disabled by default



  app.axes = new THREE.AxisHelper( 40 );
  app.scene.add( app.axes );

  // var planeGeometry = new THREE.PlaneGeometry( 120, 20 ); // 120 x 20 plane
  // var planeMaterial = new THREE.MeshLambertMaterial({
  //   color: 0xCFD8DC  // hex colour, kind of a grey
  // });
  //
  // app.plane = new THREE.Mesh( planeGeometry, planeMaterial ); // bring together shape and material
  //
  // app.plane.rotation.x = -0.5 * Math.PI; //don't ask, it's because of math
  // app.plane.position.x = 15;
  // app.plane.position.y = 0;
  // app.plane.position.z = 0;
  // app.plane.receiveShadow = true;
  //
  // app.scene.add( app.plane );


  // var cubeGeometry = new THREE.BoxGeometry( 4, 4, 4 );
  // var cubeMaterial = new THREE.MeshLambertMaterial({
  //   color: 0xFF8F00,
  //   wireframe: false
  // });

  // app.cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
  //
  // app.cube.position.set( 0, 0, 0 );
  // app.cube.castShadow = false;
  //
  // app.scene.add( app.cube );


  var sphereGeometry = new THREE.SphereGeometry( 16, 30, 30 );
  var sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0xFFFFFF,
    wireframe: false,
    // map: THREE.ImageUtils.loadTexture("/img/heart.png")

  });

  app.sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );

  app.sphere.position.set( 20, 4, 2);
  app.sphere.castShadow = false;

  app.scene.add( app.sphere );


  app.spotlight = new THREE.SpotLight( 0xFFFFFF );  // nominative determinism yo
  app.spotlight.position.set( -12, 60, 10 );
  app.spotlight.castShadow = false;
  app.scene.add( app.spotlight );

  app.light = new THREE.AmbientLight();
  app.light.color.setRGB( 0.4, 0.4, 0.4 );
  app.scene.add( app.light );

  app.particleSystem = app.createParticleSystem();
  app.scene.add ( app.particleSystem );

  // app.cubeFleet = app.createCubeFleet( app.numCubes, app.cubeDistribution );
  //
  // app.cubeFleet.forEach(function( cube ){
  //   // console.log(cube);
  //   app.scene.add( cube );
  // });

  app.controls = new THREE.OrbitControls( app.camera, app.renderer.domElement );

  app.gui = new dat.GUI();  //graphical user interface
  app.gui.add( app.controller, 'rotationSpeed', 0, 0.2 );
  app.gui.add( app.controller, 'bouncingSpeed', 0, 2.0 );

  app.stats = app.addStats();  //stats-statistics

  document.getElementById("output").appendChild(app.renderer.domElement);

  app.animate();

};



 // app.particle = app.createParticle();



app.animate = function(){

  app.stats.update();
  //
  // app.cube.rotation.x += app.controller.rotationSpeed;
  // app.cube.rotation.y += app.controller.rotationSpeed;
  // app.cube.rotation.z += app.controller.rotationSpeed;

  app.step += app.controller.bouncingSpeed;

  // app.sphere.position.x = 20 + (10 * Math.cos( app.step ));
  // app.sphere.position.y =  4 + (10 * Math.abs( Math.sin( app.step )));

  app.sphere.rotation.y +=  app.controller.rotationSpeed;

  app.animateParticles();
  // app.animateCubes();

  app.renderer.render( app.scene, app.camera );

  requestAnimationFrame( app.animate );

};

// app.animateCubes = function(){
//
//   for( var i = 0; i < app.cubeFleet.length; i++ ){
//     app.cubeFleet[i].rotation.x += app.cubeFleet[i].rotate_step;
//     app.cubeFleet[i].rotation.y += app.cubeFleet[i].rotate_step;
//     app.cubeFleet[i].rotation.z += app.cubeFleet[i].rotate_step;
//   }
// };
//
// app.createCubeFleet = function( cubeCount, cubeDistribution ){
//
// // console.log( cubeCount, cubeDistribution );
//
//   var cubes = new Array( cubeCount );
//
//   for( var i = 0; i < cubes.length; i++ ){
//
//     var cubeSize = app.randRange( 2, 12 );
//     var cubeGeometry = new THREE.BoxGeometry( cubeSize, cubeSize, cubeSize );
//     var cubeMaterial = new THREE.MeshLambertMaterial({
//       // color: 0xFF8F00,
//       wireframe: false
//     });
//
//     cubes[i] = new THREE.Mesh( cubeGeometry, cubeMaterial );
//
//     cubes[i].material.color.setRGB( Math.random(), Math.random(), Math.random() );
//
//     cubes[i].position.set(
//       app.randRange( -cubeDistribution, cubeDistribution ),
//       app.randRange( -cubeDistribution, cubeDistribution ),
//       app.randRange( -cubeDistribution, cubeDistribution )
//      );
//     // console.log( cubes[i].position )
//     cubes[i].castShadow = false;
//
//     cubes[i].rotate_step = app.randRange( -0.1, 0.1 );
//
//
//   } // end for
//
//
//   return cubes;
// };



app.randRange = function(min, max){
  var range = max - min;
  return min + (Math.random() * range);
};

app.createParticle = function(){

  console.log('createParticle', app.visibleParticles, app.particleSystem.geometry.vertices[ app.visibleParticles ])
  var particle = app.particleSystem.geometry.vertices[ app.visibleParticles ];
  particle.hidden = false;
  console.log(app.camera.position);
  particle.set( app.camera.position.x, app.camera.position.y, app.camera.position.z );
  console.log( particle );
  app.visibleParticles++;

};

app.createParticleSystem = function() {

    var particles = new THREE.Geometry(); // a basic collection of vertices (i.e. points)

  particles.userData = []; // to keep track of particles

  var pcolours = [];
  var x, y, z;
  var particle;

  for( var p = 0; p < app.numParticles; p++ ){


      // var x = app.randRange(-300, 300);

      if( p < app.visibleParticles ){

        // visible particles

        x = app.randRange( -app.particleDistribution, app.particleDistribution );
        y = app.randRange( -app.particleDistribution, app.particleDistribution );
        z = app.randRange( -app.particleDistribution, app.particleDistribution );

        particle = new THREE.Vector3( x, y, z ); // create this specific vertex (vertex = single of vertices)

        particle.vx = app.randRange( -0.2, 0.2 );
        particle.vy = app.randRange( -0.2, 0.2 );
        particle.vz = app.randRange( -0.2, 0.2 );

        particle.hidden = false;

      } else {

        // hidden particles

        x = 10000;
        y = 10000;
        z = 10000;

        particle = new THREE.Vector3( x, y, z ); // create this specific vertex (vertex = single of vertices)

        particle.vx = 0;
        particle.vy = 0;
        particle.vz = 0;

        particle.hidden = true;

      }


      particles.userData.push( particle );

      // particle.textcontent = 'hello! ' + (Math.random()).toString();
      particle.textcontent = @tweet.text;
      particles.vertices.push( particle ); // add to our collection of vertices

      pcolours[p] = new THREE.Color(1.0, 1.0, 1.0); // initialise a colour for each particle


     }

  var particleMaterial = new THREE.PointsMaterial({
          // color: 0xff8080,
          vertexColors: THREE.VertexColors,  // tell the material to pay attention to individual particle colours
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





    app.animateParticles = function(){

    var verts = app.particleSystem.geometry.vertices;

    for( var i = 0; i < verts.length; i++ ){

    var vert = verts[i];
    //
    // if( vert.y  < - app.particleDistribution ){
    //   vert.y = app.randRange( -app.particleDistribution, app.particleDistribution );
    // }

    // vert.y -= app.controller.rotationSpeed;

    var dist = Math.sqrt( vert.x*vert.x  + vert.y*vert.y + vert.z*vert.z ); //distance = squareroot(   )

    var force = (10.0/(dist*dist)) * -0.8; //changed from -0.05 to -0.8

    vert.vx += force * vert.x;
    // vert.vy += force * vert.y;
    // vert.vz += force * vert.z;


    vert.x += vert.vx * app.controller.rotationSpeed*20;
    vert.y += vert.vy * app.controller.rotationSpeed*20;
    vert.z += vert.vz * app.controller.rotationSpeed*20;

  }

  app.particleSystem.geometry.verticesNeedUpdate = true;
};


app.onResize = function(){

  app.width = window.innerWidth;
  app.height = window.innerHeight;

  app.camera.aspect = app.width / app.height;
  app.camera.updateProjectionMatrix();

  app.renderer.setSize( app.width, app.height );

};


app.addStats = function() {

  var stats = new Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';

  document.getElementById("stats").appendChild( stats.domElement );

  return stats;
};

window.addEventListener( "resize", app.onResize);



window.onload = app.init; // instead of jQuery

$(document).mousedown(function (e) {
  console.log('mousedown');
       e.preventDefault();
       mouse.x =  ( e.clientX / app.renderer.domElement.width  ) * 2 - 1;
       mouse.y = -( e.clientY / app.renderer.domElement.height ) * 2 + 1;
       raycaster.setFromCamera( mouse, app.camera );
       var intersects = raycaster.intersectObject( app.particleSystem, true );
       if (intersects.length > 0) {
           //console.log( 'intersects', intersects );
           // Points.js::raycast() doesn't seem to sort this correctly atm,
           // but how many points are found depends on the threshold set
           // on the raycaster as well

           intersects = intersects.sort( function( a, b ) {
               return a.distanceToRay - b.distanceToRay;
           });  // sort into an array with the nearest point at the start

           var particle = intersects[0];
          //  debugger;
           console.log( 'got a click on particle',
            //app.particleSystem.geometry.vertices[ particle.index],
            particle.index, particle,
              app.particleSystem.geometry.vertices[ particle.index].textcontent
           );

          //  debugger;

            app.particleSystem.geometry.colors[ particle.index ].setRGB(Math.random(), Math.random(), Math.random());

            var vertex = app.particleSystem.geometry.vertices[ particle.index];
            vertex.vx = vertex.vy = vertex.vz = 0;

            app.particleSystem.geometry.colorsNeedUpdate = true;

            var divXY = toScreenXY(vertex, app.camera, app.renderer.domElement);

            $el = $('<div id="stuff">').css({
              width: '200px',
              height: '50px',
              position: 'absolute',
              top: divXY.y + "px",
              left: divXY.x + "px",
              color: '#CCCCCC',
              padding: '4px',
              fontSize: '10pt',
              backgroundColor: "rgba(1,1,1,0.3)",
              border: "1px solid gray"
            })
            .html( app.particleSystem.geometry.vertices[ particle.index].textcontent )
            .appendTo( $('body') );

            setTimeout(function(){ $el.remove(); }, 500);

   }

 });

//  converting 3d position to 2d screen position, from http://stackoverflow.com/questions/11534000/three-js-converting-3d-position-to-2d-screen-position
 function toScreenXY( position, camera, div ) {
  var pos = position.clone();
  projScreenMat = new THREE.Matrix4();
  projScreenMat.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
  pos.applyProjection( projScreenMat );

  var offset = findOffset(div);

  return { x: ( pos.x + 1 ) * div.width / 2 + offset.left,
       y: ( - pos.y + 1) * div.height / 2 + offset.top };

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
