"""DAYTONA 404 — editable Blender garage for the five Phase-4 cars.

Run from project root with Blender 3.6+ / 4.x:
    blender --background --python blender/generar_flota.py

For each car, builds a separate, editable .blend and exports a locally hosted GLB.
The shipping Phase-4 GLBs are offline preview exports: this script has not been
executed against a Blender installation in the CI environment. Re-exporting
replaces the previews with Blender versions; keep a backup if needed.
"""
from pathlib import Path
import runpy
import bpy

ROOT=Path(__file__).resolve().parents[1]
# Reuse the original stock-car geometry and material generation tools.
parts=runpy.run_path(str(ROOT/'blender/generar_stockcar.py'))
paint=parts['RED']; deep=parts['DEEP']; ivory=parts['IVORY']; dark=parts['DARK'];
cube=parts['cube']
cars=[
 ('falcon','FALCON GT',(57,156,239),'coupe'),
 ('comet','COMET RS',(251,184,61),'gt'),
 ('viper','VIPER XR',(79,220,163),'sport'),
 ('nova','NOVA 88',(205,110,235),'rally'),
 ('blaze','BLAZE V12',(249,111,77),'muscle'),
]

def recolor(material,rgb):
    rgba=tuple(x/255 for x in rgb)+(1,)
    material.diffuse_color=rgba
    material.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=rgba

for cid,name,rgb,kit in cars:
    recolor(paint,rgb)
    recolor(deep,tuple(round(c*.66) for c in rgb))
    extra=[]
    def add(n,center,size,material):
        extra.append(cube(name+' · '+n,center,size,material,.035))
    if kit=='coupe':
        add('Aero front',(0,.40,4.06),(3.25,.23,.80),dark)
        add('Twin-plane wing',(0,1.53,-3.92),(3.98,.23,.60),ivory)
    elif kit=='gt':
        add('GT rear wing',(0,1.80,-3.94),(4.2,.3,.8),dark)
        add('Air scoop',(0,1.55,2.75),(1.2,.23,1.0),deep)
    elif kit=='sport':
        for side in [-1,1]:
            add('Front splitter fin',(side*1.58,.60,1.4),(.36,.62,1.8),ivory)
            add('Rear spoiler support',(side*1.36,1.9,-3.66),(.2,.85,.52),dark)
    elif kit=='rally':
        add('Roof intake',(0,2.82,-.70),(2,.25,2.1),dark)
        for side in [-1,1]:add('Roof rail',(side*1.32,2.72,-.70),(.15,.45,3.6),ivory)
    elif kit=='muscle':
        add('Supercharger',(0,1.76,2.4),(1.45,.58,1.7),deep)
        add('Deep splitter',(0,.46,4.03),(3.4,.42,.45),dark)
    bpy.ops.object.select_all(action='DESELECT')
    for ob in bpy.context.scene.objects:
        if ob.type=='MESH':ob.select_set(True)
    bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'blender'/f'{cid}.blend'))
    bpy.ops.export_scene.gltf(filepath=str(ROOT/'assets/models'/f'{cid}.glb'),
                              export_format='GLB',export_yup=True,export_apply=True)
    print('Exported',name)
    for ob in extra:bpy.data.objects.remove(ob,do_unlink=True)
print('DAYTONA 404: garage completed')
