"""DAYTONA 404 · Phase 6 Blender studio for editable GLB cars.

Requires Blender 3.6+/4.x (not required to PLAY the game).
Run from repo root:
  blender --background --python blender/crear_estudio_f6.py -- racer
  blender --background --python blender/crear_estudio_f6.py -- falcon render

Loads the exact offline GLB shipped with the game and saves an editable .blend
studio; optional 'render' creates a local PNG. Editing and exporting meshes is a
MANUAL step: this script never silently overwrites shipped game models.
"""
from pathlib import Path
import math
import sys
import bpy

ROOT=Path(__file__).resolve().parents[1]
CARS={'racer':'racer-04','falcon':'falcon','comet':'comet','viper':'viper','nova':'nova','blaze':'blaze'}
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
car=args[0] if args else 'racer'
if car not in CARS:
    raise ValueError('Coche no válido: '+car)
asset=ROOT/'assets'/'models'/(CARS[car]+'.glb')
if not asset.is_file():
    raise FileNotFoundError(asset)
outdir=ROOT/'blender'/'estudios'
outdir.mkdir(exist_ok=True)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=str(asset))

# Rotate the full imported collection by grouping under one empty, without
# touching vertex order or vertex colors. The model +Z direction is forward.
meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']
if not meshes:raise RuntimeError('GLB sin malla')
for o in meshes:o.name='DAYTONA 404 — '+car.upper()+' — '+o.name

def material(name,color,roughness=.75,metallic=.0):
    m=bpy.data.materials.new(name);m.diffuse_color=(*color,1)
    m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value=(*color,1)
    p.inputs['Roughness'].default_value=roughness
    p.inputs['Metallic'].default_value=metallic
    return m

floor=material('Studio / graphite',(.025,.04,.067))
bpy.ops.mesh.primitive_plane_add(size=250,location=(0,0,-.42))
ground=bpy.context.object;ground.name='Studio floor';ground.data.materials.append(floor)
# Blender Z-up, GLB axis conversion is handled by Blender importer.

def light(name,position,power,color,size):
    obj=bpy.data.lights.new(name,'AREA');obj.energy=power;obj.color=color;obj.shape='DISK';obj.size=size
    ob=bpy.data.objects.new(name,obj);bpy.context.collection.objects.link(ob);ob.location=position
    direction=-ob.location;ob.rotation_euler=direction.to_track_quat('-Z','Y').to_euler()
light('Key / golden sun',(8,-7,12),2100,(1.0,.74,.44),8)
light('Rim / electric blue',(-7,5,10),2800,(.35,.73,1.0),7)
light('Softbox',(1,9,15),1650,(1.0,1.0,1.0),10)

cam_data=bpy.data.cameras.new('Arcade studio / camera');camera=bpy.data.objects.new('Arcade studio / camera',cam_data)
bpy.context.collection.objects.link(camera);camera.location=(11,-16,9)
camera.rotation_euler=(-camera.location).to_track_quat('-Z','Y').to_euler();cam_data.type='PERSP';cam_data.lens=36
scene=bpy.context.scene;scene.camera=camera
scene.render.engine='CYCLES';scene.cycles.samples=24
scene.render.resolution_x=1280;scene.render.resolution_y=720;scene.render.resolution_percentage=100
scene.world.color=(.035,.05,.075)
source=outdir/f'REMASTER-{car.upper()}.blend'
bpy.ops.wm.save_as_mainfile(filepath=str(source))
print('Editable Blender studio:',source)
if 'render' in args:
    scene.render.filepath=str(outdir/f'REMASTER-{car.upper()}.png')
    bpy.ops.render.render(write_still=True)
    print('Preview:',scene.render.filepath)
