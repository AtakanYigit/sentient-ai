import { Column, Entity, Index } from "typeorm";

@Index("past_visions_pkey", ["id"], { unique: true })
@Entity("past_visions", { schema: "public" })
export class PastVisions {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("character varying", { name: "vision" })
  vision: string;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;
}
