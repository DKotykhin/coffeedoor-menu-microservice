import { Column, Entity, OneToMany } from 'typeorm';

import { MenuItem } from '../../menu-item/entities/menu-item.entity';
import { BaseEntity } from '../../database/base.entity';
import { LanguageCode } from '../../database/db.enums';

@Entity()
export class MenuCategory extends BaseEntity {
  @Column({ type: 'enum', enum: LanguageCode, default: LanguageCode.UA })
  language: LanguageCode;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: false })
  hidden: boolean;

  @Column({ default: 0 })
  position: number;

  @OneToMany(() => MenuItem, (item) => item.menuCategory, { cascade: true })
  menuItems: MenuItem[];
}
