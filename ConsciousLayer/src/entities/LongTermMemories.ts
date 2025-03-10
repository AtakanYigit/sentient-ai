import { Column, Entity, Index } from "typeorm";

@Index("long_term_memories_pkey", ["id"], { unique: true })
@Entity("long_term_memories", { schema: "public" })
export class LongTermMemories {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("character varying", { name: "memory" })
  memory: string;

  @Column("timestamp with time zone", {
    name: "last_accessed",
    default: () => "CURRENT_TIMESTAMP",
  })
  lastAccessed: Date;

  @Column("integer", { name: "total_accesses", default: () => "0" })
  totalAccesses: number;

  @Column("integer", { name: "levelOfImportance" })
  levelOfImportance: number;

  @Column("time with time zone", {
    name: "last_checked",
    default: () => "CURRENT_TIMESTAMP",
  })
  lastChecked: string;

  @Column("integer", { name: "total_accesses_last", default: () => "0" })
  totalAccessesLast: number;
}
