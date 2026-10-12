"""CHASE 404 - Fase 2.1: biblioteca original de arquitectura y mobiliario.

Uso: blender --background --python blender/chase_asset_library.py
No pisa assets/models ni los .blend previos. Exporta a assets/staging.
Coordenadas: Blender Z arriba, GLB Y arriba; escala orientativa 1 unidad = 1 m.
"""
from pathlib import Path
import json
import bpy

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets' / 'staging'
OUT.mkdir(parents=True, exist_ok=True)

COLORS = {
    'stucco_ochre': (.63, .47, .32, 1),
    'stucco_sand': (.74, .67, .52, 1),
    'stucco_pink': (.72, .47, .43, 1),
    'concrete': (.48, .49, .47, 1),
    'roof': (.35, .29, .27, 1),
    'iron': (.16, .18, .19, 1),
    'glass': (.16, .28, .31, 1),
    'wood': (.35, .21, .13, 1),
    'awning': (.23, .34, .28, 1),
    'yellow': (.76, .57, .24, 1),
    'brick': (.49, .29, .22, 1),
}


def clear():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)


def material(name):
    mat = bpy.data.materials.get('CHASE_' + name)
    if not mat:
        mat = bpy.data.materials.new('CHASE_' + name)
        mat.use_nodes = True
        mat.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = COLORS[name]
        mat.diffuse_color = COLORS[name]
    return mat


def cuboid(name, xyz, size, color, bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=xyz)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(material(color))
    if bevel > 0:
        mod = obj.modifiers.new('Soft corners', 'BEVEL')
        mod.width = bevel
        mod.segments = 1
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=mod.name)
    return obj


def façade(name, tone, floors=3, shop=False):
    """Fachada modular de 8 m ancho x 4 m fondo; origen centrado a nivel de calle."""
    clear()
    height = floors * 3.15
    cuboid(name + '_shell', (0, 2, height/2), (8, 4, height), tone)
    cuboid('cornice', (0, 2, height + .12), (8.4, 4.25, .24), 'roof')
    for floor in range(floors):
        y = 1.65 + floor * 3.15
        if floor == 0 and shop:
            cuboid('shopfront', (0, -.08, 1.4), (5.7, .09, 2.3), 'wood')
            cuboid('shop_glass', (0, -.14, 1.5), (5.0, .1, 1.65), 'glass')
            cuboid('awning', (0, -.8, 2.8), (6.3, 1.7, .15), 'awning')
            continue
        for x in (-2.35, 2.35):
            cuboid('shutter', (x, -.055, y), (1.55, .12, 1.64), 'wood')
            cuboid('window_glass', (x, -.14, y + .05), (1.27, .06, 1.34), 'glass')
            cuboid('lintel', (x, -.18, y + .9), (1.82, .22, .14), 'concrete')
            if floor > 0:
                cuboid('balcony_slab', (x, -.46, y - 1.0), (2.2, .95, .16), 'concrete')
                cuboid('balcony_rail', (x, -.91, y - .53), (2.1, .08, .8), 'iron')
    cuboid('roof_access', (2.15, 2.8, height + .67), (2.2, 2.0, 1.3), 'concrete')


def retaining_wall():
    clear()
    cuboid('wall_body', (0, 0, 1.1), (8, .6, 2.2), 'brick')
    cuboid('coping', (0, 0, 2.25), (8.2, .85, .2), 'concrete')
    for x in (-3, -1, 1, 3):
        cuboid('mortar_detail', (x, -.315, .85), (.08, .04, 1.3), 'roof')


def streetlamp():
    clear()
    cuboid('base', (0, 0, .22), (.5, .5, .44), 'concrete', .045)
    cuboid('pole', (0, 0, 2.65), (.13, .13, 5.0), 'iron')
    cuboid('arm', (.55, 0, 5.10), (1.25, .12, .12), 'iron')
    cuboid('lantern', (1.10, 0, 4.91), (.65, .42, .28), 'yellow')


def telephone_box():
    clear()
    cuboid('base', (0, 0, .11), (1.05, .88, .22), 'concrete')
    cuboid('body', (0, 0, 1.25), (.9, .75, 2.1), 'iron')
    cuboid('front', (0, -.393, 1.32), (.72, .04, 1.65), 'glass')
    cuboid('sign', (0, -.45, 2.18), (.75, .06, .21), 'yellow')


def export_asset(asset_name, build):
    build()
    bpy.ops.object.select_all(action='DESELECT')
    meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH']
    for obj in meshes:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    target = OUT / (asset_name + '.glb')
    bpy.ops.export_scene.gltf(filepath=str(target), export_format='GLB', use_selection=True,
                               export_yup=True, export_apply=True, export_materials='EXPORT')
    print('CHASE export:', target)
    return target


if __name__ == '__main__':
    items = {
        'facade_ochre_3f': lambda: façade('Carmel_ochre', 'stucco_ochre', 3),
        'facade_sand_shop_3f': lambda: façade('Carmel_shop', 'stucco_sand', 3, True),
        'facade_pink_4f': lambda: façade('Carmel_pink', 'stucco_pink', 4),
        'retaining_wall': retaining_wall,
        'streetlamp_1984': streetlamp,
        'telephone_cabinet': telephone_box,
    }
    manifest = {'format': 'CHASE-404-staging-v1', 'coordinate_system': 'glTF_Y_UP',
                'units': 'metres', 'assets': []}
    for name, create in items.items():
        target = export_asset(name, create)
        manifest['assets'].append({'id': name, 'file': target.name, 'status': 'staging',
                                   'triangles_limit': 12000})
    (OUT / 'catalog.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf8')
    print('CHASE library: 6 prototypes exported to staging.')
