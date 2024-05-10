import { Column, Entity, ManyToOne } from 'typeorm';

import { MenuCategory } from '../../menu-category/entities/menu-category.entity';
import { BaseEntity } from '../../database/base.entity';
import { LanguageCode } from '../../database/db.enums';

@Entity()
export class MenuItem extends BaseEntity {
  @Column({ type: 'enum', enum: LanguageCode, default: LanguageCode.UA })
  language: LanguageCode;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  price: string;

  @Column({ default: false })
  hidden: boolean;

  @Column({ default: 0 })
  position: number;

  @ManyToOne(() => MenuCategory, (item) => item.menuItems, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  menuCategory: MenuCategory;
}
