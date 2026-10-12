"""CHASE 404 v0.4.2: Blender 4.x. Loads the runtime-approved GLB and saves an editable .blend.
Usage: blender -b --python blender/editar_verenne_v8.py
Blender is only a content-authoring tool; the game itself remains browser-native.
"""
import bpy
from pathlib import Path
root = Path(__file__).resolve().parents[1]
model = root / 'assets' / 'models' / 'blaze.glb'
output = root / 'blender' / 'VERENNE_V8_1984.blend'
if not model.is_file():
    raise FileNotFoundError(f'Build the GLB first: node tools/build_fleet_glb.mjs ({model})')
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=str(model))
for obj in bpy.context.scene.objects:
    if obj.type == 'MESH':
        obj.name = 'VerenneV8_Carroceria'
        obj.data.name = 'VerenneV8_MallaEditable'
bpy.context.scene.render.engine = 'BLENDER_EEVEE_NEXT'
bpy.ops.wm.save_as_mainfile(filepath=str(output))
print('CHASE 404: saved Blender editable source:', output)
