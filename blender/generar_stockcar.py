"""DAYTONA 404 · Editable stock car F2 (Blender 3.6+, 4.x).
Run from project root: blender --background --python blender/generar_stockcar.py
Writes blender/racer-04.blend and assets/models/racer-04.glb.
No external assets required. Vehicle local axes: X right, Y up, +Z nose.
Blender native axes differ: coordinates are converted to X, -Z, Y before export.
Only the body is exported: wheels are animated independently by the game.
"""
from pathlib import Path
import bpy

ROOT = Path(__file__).resolve().parents[1]

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

def mat(name, rgb, metal=0.0, rough=0.45):
    m=bpy.data.materials.new(name)
    m.diffuse_color=(*rgb,1)
    m.use_nodes=True
    bsdf=m.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value=(*rgb,1)
    bsdf.inputs['Metallic'].default_value=metal
    bsdf.inputs['Roughness'].default_value=rough
    return m

RED=mat('404 · Racing Coral',(.87,.19,.24),.28)
DEEP=mat('404 · Deep Red',(.57,.10,.18),.22)
IVORY=mat('404 · Ivory Racing Lines',(.96,.94,.87))
GLASS=mat('404 · Cyan Window',(.18,.45,.59),.18,.14)
DARK=mat('404 · Graphite',(.09,.14,.19),.30)
SILVER=mat('404 · Brushed Alloy',(.56,.64,.67),.75)
AMBER=mat('404 · Amber Lamps',(1,.71,.25))

def xyz(v):
    x,y,z=v
    return (x,-z,y)

def cube(name,center,size,material,bevel=0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=xyz(center))
    o=bpy.context.object;o.name=name
    o.dimensions=(size[0],size[2],size[1])
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    o.data.materials.append(material)
    if bevel:
        m=o.modifiers.new('Panel highlights','BEVEL');m.width=bevel;m.segments=2
        o.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
    return o

def mesh_object(name,vertices,quads,material):
    me=bpy.data.meshes.new(name)
    me.from_pydata([xyz(v) for v in vertices],[],quads)
    me.update()
    ob=bpy.data.objects.new(name,me)
    bpy.context.collection.objects.link(ob)
    me.materials.append(material)
    return ob

def tapered(name,z,lo_y,hi_y,lo_w,lo_l,hi_w,hi_l,material):
    verts=[]
    for y,w,l in ((lo_y,lo_w,lo_l),(hi_y,hi_w,hi_l)):
        verts += [[-w/2,y,z-l/2],[w/2,y,z-l/2],[w/2,y,z+l/2],[-w/2,y,z+l/2]]
    faces=[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]
    return mesh_object(name,verts,faces,material)

def quad(name,vertices,material):
    ob=mesh_object(name,vertices,[(0,1,2,3)],material)
    ob.data.materials[0].use_nodes=True
    return ob

tapered('Aero floor',0,.37,.65,3.20,7.92,3.20,7.74,DARK)
tapered('Painted shell',0,.62,1.34,3.41,7.68,3.15,7.37,RED)
tapered('Long hood',2.42,1.31,1.49,3.13,2.73,3.06,2.65,RED)
tapered('Rear deck',-2.90,1.27,1.43,3.12,1.62,3.02,1.57,RED)
tapered('Roof frame',-.48,1.36,2.48,2.79,3.9,2.25,2.33,DEEP)
quad('Windshield',[[ -1.09,2.497,.63],[1.09,2.497,.63],[1.38,1.46,1.35],[-1.38,1.46,1.35]],GLASS)
quad('Rear glass',[[1.1,2.497,-1.59],[-1.1,2.497,-1.59],[-1.38,1.46,-2.45],[1.38,1.46,-2.45]],GLASS)
for side in (-1,1):
    quad('Side glass',[[side*1.155,2.46,-1.48],[side*1.155,2.46,.46],[side*1.408,1.51,1.11],[side*1.408,1.51,-2.27]],GLASS)
    cube('Twin bonnet racing stripe',(side*.63,1.512,2.56),(.35,.033,2.05),IVORY)
    cube('Roof racing stripe',(side*.56,2.50,-.44),(.30,.025,1.67),IVORY)
    cube('Lower side skirt',(side*1.68,.64,0),(.08,.19,5.65),DARK)
    cube('Front lamp',(side*1.17,.99,3.77),(.82,.36,.095),AMBER,.025)
    cube('Rear lamp',(side*1.15,.98,-3.83),(.81,.25,.09),DEEP)
    cube('Door handle',(side*1.63,1.40,-.51),(.06,.055,.38),SILVER)
    cube('Mirror stem',(side*1.65,1.66,.8),(.10,.25,.1),SILVER)
    cube('Mirror shell',(side*1.75,1.78,.82),(.31,.18,.45),DARK,.04)
    cube('Front wheel arch',(side*1.6,.95,2.35),(.11,.1,1.8),DARK)
    cube('Rear wheel arch',(side*1.6,.95,-2.37),(.11,.1,1.8),DARK)
    x=side*1.707
    for y,z,dy,dz in ((1.04,.52,.49,.11),(1.04,-.06,.49,.11),(1.26,.23,.08,.5),(.8,.23,.07,.5),(1.04,-.58,.51,.1),(1.27,-.37,.09,.4),(.8,-.78,.08,.4)):
        cube('Side number 04',(x,y,z),(.055,dy,dz),IVORY)
for name,point,size,material in [
    ('Front bumper',(0,.62,3.84),(3.29,.42,.26),DARK),
    ('Front grill',(0,.97,3.875),(1.44,.28,.08),SILVER),
    ('Front splitter',(0,.4,3.95),(3.5,.075,.45),DARK),
    ('Rear bumper',(0,.71,-3.88),(3.26,.42,.26),DARK),
    ('Rear spoiler blade',(0,1.82,-3.72),(3.64,.16,.72),DARK),
    ('Rear numberboard',(0,1.04,-3.91),(1.06,.26,.05),IVORY),
    ('Roof vent',(0,2.525,-1.2),(.61,.06,.32),DARK)
]:cube(name,point,size,material,.02)
for side in (-1,1):cube('Spoiler upright',(side*1.2,1.51,-3.61),(.18,.54,.17),SILVER)

# Lighting/camera are useful in the saved .blend file, but NOT part of the export.
bpy.ops.object.select_all(action='SELECT')
BLEND=ROOT/'blender'/'racer-04.blend'
bpy.ops.wm.save_as_mainfile(filepath=str(BLEND))
DEST=ROOT/'assets'/'models'/'racer-04.glb'
DEST.parent.mkdir(parents=True,exist_ok=True)
bpy.ops.export_scene.gltf(filepath=str(DEST),export_format='GLB',export_yup=True,export_apply=True)
print('DAYTONA 404 Blender scene saved:',BLEND)
print('DAYTONA 404 GLB exported:',DEST)
